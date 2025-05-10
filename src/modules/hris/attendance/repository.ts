import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Attendance } from './schema'
import {
  addDays,
  differenceInDays,
  endOfDay,
  startOfDay,
  eachDayOfInterval,
  formatISO,
  subDays,
} from 'date-fns'

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
      `Data presensi untuk tanggal ini sudah tercatat sebelumnya`,
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

export const update = async (payload: Attendance & { createdBy: string }) => {
  if (!payload.employeeId || !payload.date) {
    throw new Error('employeeId dan date wajib ada')
  }

  const existing = await db.attendance.findFirst({
    where: {
      employeeId: payload.employeeId,
      date: new Date(payload.date),
    },
  })

  if (existing) {
    return await db.attendance.update({
      where: { id: existing.id },
      data: {
        type: payload.type,
      },
    })
  } else {
    return await db.attendance.create({
      data: {
        employeeId: payload.employeeId,
        date: new Date(payload.date),
        type: payload.type,
        createdBy: payload.createdBy,
      },
    })
  }
}

type ReadAllParams = {
  startDate: Date
  search?: string
  position?: string
  page?: number
  limit?: number
}
export const readAll = async ({
  startDate,
  search,
  position,
  page,
  limit,
}: ReadAllParams) => {
  const whereEmployee: Prisma.EmployeeWhereInput = {
    deletedAt: null,
    fullname: search ? { contains: search, mode: 'insensitive' } : undefined,
    position: position || undefined,
    active: true,
  }

  if (page === undefined || limit === undefined) {
    const employees = await db.employee.findMany({
      where: whereEmployee,
      select: {
        id: true,
        fullname: true,
        position: true,
        attendances: {
          where: {
            date: {
              gte: startDate,
              lte: startDate,
            },
          },
          select: {
            type: true,
          },
        },
      },
    })

    const data = employees.map((employee) => {
      const attendance = employee.attendances[0]
      return {
        employeeId: employee.id,
        fullname: employee.fullname,
        position: employee.position ?? '-',
        status: attendance?.type ?? null,
      }
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [employees, total] = await Promise.all([
    db.employee.findMany({
      where: whereEmployee,
      skip,
      take,
      orderBy: {
        fullname: 'asc',
      },
      select: {
        id: true,
        fullname: true,
        position: true,
        attendances: {
          where: {
            date: {
              gte: startDate,
              lte: startDate,
            },
          },
          select: {
            type: true,
          },
        },
      },
    }),
    db.employee.count({ where: whereEmployee }),
  ])

  const data = employees.map((employee) => {
    const attendance = employee.attendances[0]
    return {
      employeeId: employee.id,
      fullname: employee.fullname,
      position: employee.position ?? '-',
      status: attendance?.type ?? null,
    }
  })

  const total_pages = Math.ceil(total / limit)

  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}

type ChartParams = {
  startDate?: Date
  endDate?: Date
}

export const readAttendanceChart = async ({
  startDate,
  endDate,
}: ChartParams) => {
  const today = new Date()
  const start = startDate
    ? startOfDay(new Date(startDate))
    : startOfDay(subDays(today, 6))
  const end = endDate ? endOfDay(new Date(endDate)) : endOfDay(today)

  const allDates = eachDayOfInterval({ start, end })

  const raw = await db.attendance.findMany({
    where: {
      date: { gte: start, lte: end },
      type: { in: ['presence', 'absent'] },
      deletedAt: null,
    },
    select: {
      date: true,
      type: true,
    },
  })

  const map = new Map<string, { presence: number; absent: number }>()

  for (const item of raw) {
    const key = formatISO(item.date, { representation: 'date' })
    if (!map.has(key)) map.set(key, { presence: 0, absent: 0 })

    const group = map.get(key)!
    if (item.type === 'presence') group.presence++
    else if (item.type === 'absent') group.absent++
  }

  const result = allDates.map((date) => {
    const key = formatISO(date, { representation: 'date' })
    const data = map.get(key)
    return {
      date: key,
      presence: data?.presence ?? 0,
      absent: data?.absent ?? 0,
    }
  })

  return result
}

export const readAttendancePerDay = async ({
  startDate,
}: {
  startDate?: string
}) => {
  const date = startDate ? new Date(startDate) : new Date()
  const start = startOfDay(date)
  const end = endOfDay(date)

  const totalEmployee = await db.employee.count({
    where: {
      deletedAt: null,
    },
  })

  const attendances = await db.attendance.findMany({
    where: {
      date: { gte: start, lte: end },
      deletedAt: null,
    },
    select: {
      employeeId: true,
      type: true,
    },
  })

  // Hitung
  let presence = 0
  let absent = 0
  const recordedEmployeeIds = new Set<string>()

  for (const att of attendances) {
    recordedEmployeeIds.add(att.employeeId)
    if (att.type === 'presence') presence++
    else if (att.type === 'absent') absent++
  }

  const notYet = totalEmployee - recordedEmployeeIds.size

  return {
    presence,
    absent,
    notYet,
    total: totalEmployee,
  }
}
