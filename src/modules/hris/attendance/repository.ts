import { createAttendanceSchema, updateAttendanceSchema } from './schema'
import Message from '../../../utils/constant/message'
import db from '../../../lib/db'
import { z } from 'zod'

type CreateAttendance = z.infer<typeof createAttendanceSchema>
type UpdateAttendance = z.infer<typeof updateAttendanceSchema>

export default class AttendanceRepository {
  private message: Message = new Message('Kehadiran')
  create = async (payload: CreateAttendance) => {
    const existing = await db.attendance.findMany({
      where: {
        employeeId: payload.employeeId,
        date: new Date(payload.date),
      },
    })
    if (existing.length > 0) {
      throw new Error(
        `Data presensi untuk tanggal ${payload.date} sudah tercatat sebelumnya`
      )
    }
    return await db.attendance.create({
      data: { ...payload, date: new Date(payload.date) },
    })
  }
  update = async (id: number, payload: UpdateAttendance) => {
    await this.isExist(id)
    await db.attendance.update({
      data: {
        ...payload,
        ...(payload.date ? { date: new Date(payload.date) } : undefined),
      },
      where: { id },
    })
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.attendance.delete({ where: { id } })
  }
  read = async (
    startDate: Date,
    { search, positionId }: { search?: string; positionId?: number }
  ) => {
    const positions = await db.position.findMany({
      where: positionId ? { id: positionId } : undefined,
      select: {
        name: true,
        employees: {
          where: {
            AND: [
              { pay_type: 'daily' },
              search
                ? {
                    OR: [
                      { fullname: { contains: search.toLowerCase() } },
                      { fullname: { contains: search.toUpperCase() } },
                      { fullname: { contains: search } },
                    ],
                  }
                : {},
            ],
          },
          select: {
            id: true,
            fullname: true,
            photo: true,
            attendances: {
              select: {
                date: true,
                id: true,
                total_hour: true,
                type: true,
              },
              where: {
                date: startDate,
              },
            },
          },
        },
      },
    })

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
