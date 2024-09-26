import db from '../../../lib/db'
import { Label } from './schema'

export default class LabelRepository {
  create = async (payload: Label) => {
    try {
      await db.goodsLabel.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Label) => {
    await db.goodsLabel.update({ data: payload, where: { id } })
    try {
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.goodsLabel.delete({ where: { id } })
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

      return await db.goodsLabel.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}
