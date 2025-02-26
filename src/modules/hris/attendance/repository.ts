import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { convertToWIB, generateDateRange } from '@/utils/generate-date-range'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Attendance } from './schema'

export const isExist = async (id: string) => {
  const data = await db.attendance.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const create = async (data: Attendance & { createdBy: string }) => {
  const existing = await db.attendance.findMany({
    where: {
      employeeId: data.employeeId,
      date: new Date(data.date),
    },
  })
  if (existing.length > 0) {
    return throwError(
      `Data presensi untuk tanggal ${data.date} sudah tercatat sebelumnya`,
      HttpStatusCode.BadRequest,
    )
  }

  return await db.attendance.create({
    data: {
      date: new Date(data.date),
      employeeId: data.employeeId,
      type: data.type,
      createdBy: data.createdBy,
    },
  })
}

export const update = async (id: string, payload: Attendance) => {
  await isExist(id)

  const data: Prisma.AttendanceUpdateInput = {
    ...(payload.date ? { date: new Date(payload.date) } : undefined),
    type: payload.type,
  }

  await db.attendance.update({
    data,
    where: { id },
  })
}

export const destroy = async (id: string) => {
  await isExist(id)
  await db.attendance.delete({ where: { id } })
}

export const readAll = async (
  startDate: Date,
  endDate?: Date,
  search?: string,
) => {
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      { status: true, deletedAt: null },
      search
        ? {
            OR: [{ fullname: { contains: search } }],
          }
        : {},
    ],
  }
  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    photoUrl: true,
    attendances: {
      select: {
        date: true,
        id: true,
        type: true,
      },
      where: endDate
        ? {
            AND: [{ date: { gte: startDate } }, { date: { lte: endDate } }],
          }
        : {
            date: startDate,
          },
    },
  }

  const employees = await db.employee.findMany({
    where,
    select,
  })

  const data = employees.map((prev) => ({
    ...prev,
    employees: data.map((employee) => ({
      ...employee,
      attendances: !endDate
        ? employee.attendances.length > 0
          ? employee.attendances
          : null
        : generateDateRange(startDate, endDate).map((date) => {
            const attendanceMap = new Map(
              employee.attendances.map((a) => {
                const wibDate = convertToWIB(a.date)
                return [wibDate.toISOString(), { ...a, date: wibDate }]
              }),
            )
            return attendanceMap.get(date) || null
          }),
    })),
  }))
  return data
}
