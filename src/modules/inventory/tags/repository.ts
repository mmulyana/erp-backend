import db from '../../../lib/db'
import { Tag } from './schema'

export default class TagRepository {
  create = async (payload: Tag) => {
    try {
      await db.supplierTag.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Tag) => {
    await db.supplierTag.update({ data: payload, where: { id } })
    try {
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.supplierTag.delete({ where: { id } })
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

      return await db.supplierTag.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}
