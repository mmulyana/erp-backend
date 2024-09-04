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
      const parsedDate = new Date(startDate)
      if (isNaN(parsedDate.getTime())) {
        throw new Error(
          `Invalid startDate: ${startDate}. Please provide a valid date string.`
        )
      }

      const dayStart = new Date(parsedDate.setHours(0, 0, 0, 0))
      const dayEnd = new Date(parsedDate.setHours(23, 59, 59, 999))

      const baseQuery = {
        where: {},
        include: {
          overtime: {
            where: {
              date: {
                gte: dayStart,
                lt: dayEnd,
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
          ],
        }
      }

      const overtimes = await db.employee.findMany(baseQuery)
      const data = overtimes.filter((employee) => !!employee.overtime.length)
      return data
    } catch (error) {
      throw error
    }
  }
}
