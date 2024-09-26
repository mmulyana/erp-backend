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
    try {
      await this.isExist(id)
      await db.supplierTag.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
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
  isExist = async (id: number) => {
    const data = await db.supplierTag.findUnique({ where: { id } })
    if (!data) throw Error('tag tidak ditemukan')
  }
}
