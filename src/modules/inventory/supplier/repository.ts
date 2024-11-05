import { deleteFile } from '../../../utils/file'
import { Supplier } from './schema'
import db from '../../../lib/db'
import { Prisma } from '@prisma/client'

export default class SupplierRepository {
  create = async (
    payload: Supplier & { photoUrl?: string; tags: string[] }
  ) => {
    return await db.supplier.create({
      data: {
        address: payload.address,
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        ...(payload.photoUrl !== ''
          ? { photoUrl: payload.photoUrl }
          : undefined),
        tags: {
          create:
            payload.tags?.map((tagId) => ({
              tag: {
                connect: { id: Number(tagId) },
              },
            })) || [],
        },
      },
    })
  }
  update = async (
    id: number,
    payload: Supplier & { newPhotoUrl?: string; photoUrl: string }
  ) => {
    await this.isExist(id)

    const data: Prisma.SupplierUpdateInput = {}

    if (payload.newPhotoUrl || payload.photoUrl == null) {
      const existing = await db.supplier.findUnique({ where: { id } })
      if (existing?.photoUrl) {
        deleteFile(existing?.photoUrl)
      }
      data.photoUrl = null
    }
    if (payload.newPhotoUrl) {
      data.photoUrl == payload.newPhotoUrl
    }
    if (payload.name) {
      data.name = payload.name
    }
    if (payload.email) {
      data.email = payload.email
    }
    if (payload.address) {
      data.address = payload.address
    }
    if (payload.phone) {
      data.phone = payload.phone
    }

    return await db.supplier.update({
      data,
      where: { id },
      select: {
        id: true,
      },
    })
  }
  updateTag = async (id: number, payload: { tagIds: number[] }) => {
    const { tagIds } = payload
    const supplier = await db.supplier.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!supplier) {
      throw new Error('Supplier not found')
    }

    const currentTagIds = supplier.tags.map((tag) => tag.tag.id)

    const tagsToConnect = tagIds.filter(
      (tagId) => !currentTagIds.includes(tagId)
    )
    const tagsToDisconnect = currentTagIds.filter(
      (tagId) => !tagIds.includes(tagId)
    )

    return await db.supplier.update({
      where: { id },
      data: {
        tags: {
          deleteMany: {
            tagId: {
              in: tagsToDisconnect,
            },
          },
          create: tagsToConnect.map((tagId) => ({
            tag: {
              connect: { id: tagId },
            },
          })),
        },
      },
      select: {
        id: true,
      },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    const data = await db.supplier.findUnique({
      where: { id },
      include: {
        tags: true,
        employees: true,
        transaction: true,
      },
    })
    if (data?.photoUrl) {
      deleteFile(data?.photoUrl)
    }

    const transactionsIds = data?.transaction.map((item) => item.id)
    const employeeIds = data?.employees.map((item) => item.id)
    const tagsIds = data?.tags.map((item) => item.id)

    // remove tags
    await db.supplierToTag.deleteMany({
      where: {
        id: {
          in: tagsIds,
        },
      },
    })

    // delete employees
    await db.supplierEmployee.deleteMany({
      where: {
        id: {
          in: employeeIds,
        },
      },
    })

    // change supplierId to null in transaction
    await db.transactionGoods.updateMany({
      data: {
        supplierId: null,
      },
      where: {
        id: {
          in: transactionsIds,
        },
      },
    })

    await db.supplier.delete({ where: { id } })
  }
  read = async (name?: string, tagId?: number) => {
    const baseQuery = {
      where: {},
      include: {
        employees: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }

    if (name) {
      baseQuery.where = {
        ...baseQuery.where,
        OR: [
          { name: { contains: name.toLowerCase() } },
          { name: { contains: name.toUpperCase() } },
          { name: { contains: name } },
        ],
      }
    }

    if (tagId) {
      baseQuery.where = {
        ...baseQuery.where,
        tags: {
          some: {
            tagId: tagId,
          },
        },
      }
    }

    return await db.supplier.findMany(baseQuery)
  }
  readOne = async (id: number) => {
    return await db.supplier.findUnique({
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      where: {
        id,
      },
    })
  }
  readTransactionBySupplierId = async (supplierId: number) => {
    return await db.transactionGoods.findMany({
      where: {
        supplierId,
      },
      include: {
        good: true,
      },
    })
  }
  isExist = async (id: number) => {
    const data = await db.supplier.findUnique({ where: { id } })
    if (!data) throw Error('Supplier tidak ditemukan')
  }
}
