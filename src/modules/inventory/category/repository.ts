import db from '../../../lib/db'
import { Category } from './schema'

export default class CategoryRepository {
  create = async (payload: Category) => {
    try {
      await db.goodsCategory.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Category) => {
    try {
      await this.isExist(id)
      await db.goodsCategory.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.goodsCategory.delete({ where: { id } })
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

      return await db.goodsCategory.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }

  isExist = async (id: number) => {
    const data = await db.goodsCategory.findUnique({ where: { id } })
    if (!data) throw Error('kategori tidak ada')
  }
}
