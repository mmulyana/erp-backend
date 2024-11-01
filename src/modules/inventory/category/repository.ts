import { Category } from './schema'
import db from '../../../lib/db'

export default class CategoryRepository {
  create = async (payload: Category) => {
    await db.goodsCategory.create({ data: payload })
  }
  update = async (id: number, payload: Category) => {
    await this.isExist(id)
    await db.goodsCategory.update({ data: payload, where: { id } })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.goodsCategory.delete({ where: { id } })
  }
  read = async (name?: string) => {
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
  }
  readOne = async (id: number) => {
    return await db.goodsCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            goods: true,
          },
        },
      },
    })
  }

  isExist = async (id: number) => {
    const data = await db.goodsCategory.findUnique({ where: { id } })
    if (!data) throw Error('kategori tidak ada')
  }
}
