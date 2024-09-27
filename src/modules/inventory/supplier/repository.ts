import db from '../../../lib/db'
import { removeImg } from '../../../utils/file'
import { Supplier } from './schema'

export default class SupplierRepository {
  create = async (payload: Supplier & { photoUrl?: string }) => {
    try {
      await db.supplier.create({
        data: {
          address: payload.address,
          name: payload.name,
          phone: payload.phone,
          status: payload.status,
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
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Supplier & { photoUrl?: string }) => {
    try {
      await this.isExist(id)
      if (payload.photoUrl) {
        const data = await db.supplier.findUnique({ where: { id } })
        if (data?.photoUrl) {
          removeImg(data?.photoUrl)
        }
      }

      await db.supplier.update({
        data: {
          address: payload.address,
          name: payload.name,
          phone: payload.phone,
          status: payload.status,
          ...(payload.photoUrl !== ''
            ? { photoUrl: payload.photoUrl }
            : undefined),
        },
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
  updateTag = async (id: number, payload: { tagIds: number[] }) => {
    try {
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

      await db.supplier.update({
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
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      const data = await db.supplier.findUnique({ where: { id } })
      if (data?.photoUrl) {
        removeImg(data?.photoUrl)
      }
      await db.supplier.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (name?: string) => {
    try {
      const baseQuery = {
        where: {},
        include: {
          employees: true,
          tags: true,
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

      return await db.supplier.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
  isExist = async (id: number) => {
    const data = await db.supplier.findUnique({ where: { id } })
    if (!data) throw Error('Supplier tidak ditemukan')
  }
}
