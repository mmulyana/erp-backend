import db from '../../../lib/db'
import { Goods } from '@prisma/client'
import { removeImg } from '../../../utils/file'

export default class GoodsRepository {
  create = async (payload: Goods & { photoUrl?: string }) => {
    try {
      await db.goods.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (
    id: number,
    payload: Partial<Goods> & { photoUrl?: string }
  ) => {
    try {
      if (payload.photoUrl) {
        const data = await db.brand.findUnique({ where: { id } })
        if (data?.photoUrl) {
          removeImg(data.photoUrl)
        }
      }
      await db.goods.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      const data = await db.goods.findUnique({ where: { id } })

      if (data?.photoUrl) {
        removeImg(data.photoUrl)
      }

      await db.goods.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (name: string | undefined) => {
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

      return await db.goods.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}
