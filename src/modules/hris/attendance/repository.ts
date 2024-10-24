import { createAttendanceSchema, updateAttendanceSchema } from './schema'
import Message from '../../../utils/constant/message'
import db from '../../../lib/db'
import { parse } from 'date-fns'
import { z } from 'zod'

type CreateAttendance = z.infer<typeof createAttendanceSchema>
type UpdateAttendance = z.infer<typeof updateAttendanceSchema>

export default class AttendanceRepository {
  private message: Message = new Message('Kehadiran')
  create = async (payload: CreateAttendance) => {
    await db.attendance.create({
      data: { ...payload, date: parse(payload.date, 'dd-MM-yyyy', new Date()) },
    })
  }
  update = async (id: number, payload: UpdateAttendance) => {
    await this.isExist(id)
    await db.attendance.update({
      data: {
        ...payload,
        ...(payload.date
          ? { date: parse(payload.date, 'dd-MM-yyyy', new Date()) }
          : undefined),
      },
      where: { id },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.attendance.delete({ where: { id } })
  }
  read = async (startDate: string, { search }: { search?: string }) => {
    const parsedDate = new Date(startDate)
    const dayStart = new Date(parsedDate.setHours(0, 0, 0, 0))
    const dayEnd = new Date(parsedDate.setHours(23, 59, 59, 999))

    const baseQuery = {
      include: {
        employees: {
          where: search
            ? {
                OR: [
                  { fullname: { contains: search.toLowerCase() } },
                  { fullname: { contains: search.toUpperCase() } },
                  { fullname: { contains: search } },
                ],
              }
            : undefined,
          include: {
            attendances: {
              where: {
                date: {
                  gte: dayStart,
                  lt: dayEnd,
                },
              },
            },
          },
        },
      },
    }

    const positions = await db.position.findMany(baseQuery)

    const data = positions
      .filter((position) => position.employees.length > 0)
      .map((position) => ({
        ...position,
        employees: position.employees.map((employee) => ({
          ...employee,
          attendances:
            employee.attendances.length > 0 ? employee.attendances : null,
        })),
      }))

    return data
  }

  private isExist = async (id: number) => {
    const data = await db.attendance.findUnique({ where: { id } })
    if (!data) throw Error(this.message.notfound())
  }
}
