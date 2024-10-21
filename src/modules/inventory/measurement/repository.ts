import db from '../../../lib/db'
import { Measurement } from './schema'

export default class MeasurementsRepository {
  create = async (payload: Measurement) => {
    await db.measurements.create({ data: payload })
  }
  update = async (id: number, payload: Measurement) => {
    await this.isExist(id)
    return await db.measurements.update({
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
    await db.measurements.delete({ where: { id } })
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

    return await db.measurements.findMany(baseQuery)
  }
  readOne = async (id: number) => {
    return await db.measurements.findUnique({
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
    const data = await db.measurements.findUnique({ where: { id } })
    if (!data) throw Error('Ukuran tidak ditemukan')
  }
}
