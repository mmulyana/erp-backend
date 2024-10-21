import db from '../../../lib/db'
import { Tag } from './schema'

export default class TagRepository {
  create = async (payload: Tag) => {
    await db.supplierTag.create({ data: payload })
  }
  update = async (id: number, payload: Tag) => {
    await this.isExist(id)
    await db.supplierTag.update({ data: payload, where: { id } })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.supplierTag.delete({ where: { id } })
  }
  read = async (name?: string) => {
    const baseQuery = {
      where: {},
      include: {
        _count: {
          select: {
            supplier: true,
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

    return await db.supplierTag.findMany(baseQuery)
  }
  readOne = async (id: number) => {
    return await db.supplierTag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            supplier: true,
          },
        },
      },
    })
  }
  isExist = async (id: number) => {
    const data = await db.supplierTag.findUnique({ where: { id } })
    if (!data) throw Error('tag tidak ditemukan')
  }
}
