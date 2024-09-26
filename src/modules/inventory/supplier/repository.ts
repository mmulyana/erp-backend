import db from '../../../lib/db'
import { Supplier } from './schema'

export default class SupplierRepository {
  create = async (payload: Supplier) => {
    try {
      await db.supplier.create({
        data: {
          address: payload.address,
          name: payload.name,
          phone: payload.phone,
          tags: {
            connect: payload.tags?.map((tagId) => ({ id: tagId })) || [],
          },
        },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Supplier) => {
    await db.supplier.update({
      data: {
        address: payload.address,
        name: payload.name,
        phone: payload.phone,
      },
      where: { id },
    })
    try {
    } catch (error) {
      throw error
    }
  }
  updateTag = async (id: number, tagIds: number[]) => {
    try {
      const supplier = await db.supplier.findUnique({
        where: { id },
        include: { tags: true },
      })

      if (!supplier) {
        throw new Error('Supplier not found')
      }

      const currentTagIds = supplier.tags.map((tag) => tag.tagId)

      const tagsToConnect = tagIds.filter((tagId) => !currentTagIds.includes(tagId))
      const tagsToDisconnect = currentTagIds.filter((tagId) => !tagIds.includes(tagId))

      await db.supplier.update({
        where: { id },
        data: {
          tags: {
            connect: tagsToConnect.map((tagId) => ({ id: tagId })),
            disconnect: tagsToDisconnect.map((tagId) => ({ id: tagId })),
          },
        },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.supplier.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (name?: string) => {
    try {
      const baseQuery = {
        where: {},
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
}
