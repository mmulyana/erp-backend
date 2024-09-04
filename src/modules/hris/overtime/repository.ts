import { z } from 'zod'
import { overtimeSchema } from './schema'
import db from '../../../lib/db'

type payload = z.infer<typeof overtimeSchema>
export default class OvertimeRepository {
  create = async (payload: payload) => {
    try {
      await db.overtime.create({
        data: { ...payload, date: new Date(payload.date).toISOString() },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: payload) => {
    try {
      await db.overtime.update({
        data: { ...payload, date: new Date(payload.date).toISOString() },
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await db.overtime.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (
    startDate: Date,
    { search, id }: { search?: string; id?: number }
  ) => {
    try {
      if (!!id) {
        const data = await db.overtime.findUnique({ where: { id } })
        return data
      }

      const baseQuery = {
        where: {},
        include: {
          overtime: {
            where: {
              date: {
                equals: startDate,
              },
            },
          },
          position: true,
        },
      }

      if (search) {
        baseQuery.where = {
          ...baseQuery.where,
          OR: [
            { fullname: { contains: search.toLowerCase() } },
            { fullname: { contains: search.toUpperCase() } },
            { fullname: { contains: search } },
          ]
        };
      }

      const data = await db.employee.findMany(baseQuery)
      return data
    } catch (error) {
      throw error
    }
  }
}
