import db from '../../../lib/db'
import { Location } from './schema'

export default class LocationRepository {
  create = async (payload: Location) => {
    try {
      await db.location.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Location) => {
    try {
      await this.isExist(id)
      await db.location.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.location.delete({ where: { id } })
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

      return await db.location.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
  isExist = async (id: number) => {
    const data = await db.location.findUnique({ where: { id } })
    if (!data) throw Error('Lokasi tidak ditemukan')
  }
}
