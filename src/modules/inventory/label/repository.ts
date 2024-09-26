import db from '../../../lib/db'
import { Label } from './schema'

export default class LabelRepository {
  create = async (payload: Label) => {
    await db.goodsLabel.create({ data: payload })
  }
  update = async (id: number, payload: Label) => {
    await this.isExist(id)
    await db.goodsLabel.update({ data: payload, where: { id } })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.goodsLabel.delete({ where: { id } })
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

    return await db.goodsLabel.findMany(baseQuery)
  }
  isExist = async (id: number) => {
    const data = await db.goodsLabel.findUnique({ where: { id } })
    if (!data) throw Error('Label tidak ditemukan')
  }
}
