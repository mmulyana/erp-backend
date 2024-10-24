import { overtimeSchema } from './schema'
import db from '../../../lib/db'
import { parse } from 'date-fns'
import { z } from 'zod'

type payload = z.infer<typeof overtimeSchema>
export default class OvertimeRepository {
  create = async (payload: payload) => {
    await db.overtime.create({
      data: {
        ...payload,
        date: parse(payload.date, 'dd-MM-yyyy', new Date()),
      },
    })
  }
  update = async (id: number, payload: payload) => {
    await db.overtime.update({
      data: {
        ...payload,
        date: parse(payload.date, 'dd-MM-yyyy', new Date()),
      },
      where: { id },
    })
  }
  delete = async (id: number) => {
    await db.overtime.delete({ where: { id } })
  }
  read = async (startDate: string, { search }: { search?: string }) => {
    const parsedDate = new Date(startDate)
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
  }
}
