import { z } from 'zod'
import { attendanceSchema } from './schema'
import db from '../../../lib/db'
import { MESSAGE_ERROR } from '../../../utils/constant/error'

type Attendance = z.infer<typeof attendanceSchema>
export default class AttendanceRepository {
  create = async (payload: Attendance) => {
    try {
      await db.attendance.create({
        data: {
          ...payload,
          date: new Date(payload.date).toISOString(),
        },
      })
    } catch (error) {
      throw error
    }
  }
  update = async (id: number, payload: Attendance) => {
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

      const baseQuery = {
        where: {},
        include: {
          attendances: {
            where: {
              date: {
                equals: startDate,
              },
            },
            take: -1,
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
      
      const employees = await db.employee.findMany(baseQuery)

      const data = employees.map((employee) => ({
        ...employee,
        attendances: employee.attendances || [],
      }))

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
