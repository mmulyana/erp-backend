import db from '../../../lib/db'
import { Measurement } from './schema'

export default class MeasurementsRepository {
  create = async (payload: Measurement) => {
    try {
      await db.measurements.create({ data: payload })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Measurement) => {
    await db.measurements.update({ data: payload, where: { id } })
    try {
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.measurements.delete({ where: { id } })
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

      return await db.measurements.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }
}