import db from '../../../lib/db'
import { Location } from './schema'

export default class LocationRepository {
  create = async (payload: Location) => {
    await db.location.create({ data: payload })
  }
  update = async (id: number, payload: Location) => {
    await this.isExist(id)
    return await db.location.update({
      data: payload,
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
  delete = async (id: number) => {
    await this.isExist(id)
    await db.location.delete({ where: { id } })
  }
  read = async (name?: string) => {
    const baseQuery = {
      where: {},
      include: {
        _count: {
          select: {
            goods: true,
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

    return await db.location.findMany(baseQuery)
  }
  readOne = async (id: number) => {
    return await db.location.findUnique({
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
    const data = await db.location.findUnique({ where: { id } })
    if (!data) throw Error('Lokasi tidak ditemukan')
  }
}
