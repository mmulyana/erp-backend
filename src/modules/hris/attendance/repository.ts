import { z } from 'zod'
import db from '../../../lib/db'
import { MESSAGE_ERROR } from '../../../utils/constant/error'
import { createAttendanceSchema, updateAttendanceSchema } from './schema'

type CreateAttendance = z.infer<typeof createAttendanceSchema>
type UpdateAttendance = z.infer<typeof updateAttendanceSchema>
export default class AttendanceRepository {
  create = async (payload: CreateAttendance) => {
    try {
      await db.attendance.create({
        data: { ...payload, date: new Date(payload.date).toISOString() },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: UpdateAttendance) => {
    try {
      await this.isExist(id)
      await db.attendance.update({
        data: {
          ...payload,
          date: new Date(payload.date).toISOString(),
        },
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      await db.attendance.delete({ where: { id } })
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
        const data = await db.attendance.findUnique({ where: { id } })
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
          attendances: {
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

      const employees = await db.employee.findMany(baseQuery)

      const data = employees.map((employee) => {
        return {
          ...employee,
          attendances: employee.attendances || [],
        }
      })

      return data
    } catch (error) {
      throw error
    }
  }

  private isExist = async (id: number) => {
    const data = await db.attendance.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.ATTENDANCE.NOT_FOUND)
  }
  private isEmployeeExist = async (id: number) => {
    const data = await db.employee.findUnique({ where: { id } })
    if (!data) throw Error(MESSAGE_ERROR.EMPLOYEE.NOT_FOUND)
  }
}
