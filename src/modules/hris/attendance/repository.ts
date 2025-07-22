import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Attendance } from './schema'
import {
  endOfDay,
  startOfDay,
  eachDayOfInterval,
  formatISO,
  subDays,
  format,
} from 'date-fns'
import { id } from 'date-fns/locale'
import { PaginationParams } from '@/types'

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

export const readAll = async ({
  startDate,
  search,
  position,
  page,
  limit,
  notYet,
}: PaginationParams & {
  startDate?: Date
  position?: string
  notYet?: boolean
}) => {
  const whereEmployee: Prisma.EmployeeWhereInput = {
    payType: 'daily',
    deletedAt: null,
    fullname: search ? { contains: search, mode: 'insensitive' } : undefined,
    active: true,
    ...(notYet
      ? {
          attendances: {
            none: {
              date: {
                gte: startDate,
                lte: startDate,
              },
            },
          },
        }
      : {}),
    ...(position
      ? {
          position: {
            contains: position,
            mode: 'insensitive',
          },
        }
      : {}),
  }

  const select: Prisma.EmployeeSelect = {
    id: true,
    fullname: true,
    photoUrl: true,
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
  }

  if (page === undefined || limit === undefined) {
    const employees = await db.employee.findMany({
      where: whereEmployee,
      select,
    })

    const data = employees.map((employee) => {
      const attendance = employee.attendances[0]
      return {
        employeeId: employee.id,
        fullname: employee.fullname,
        position: employee.position ?? '-',
        status: attendance?.type ?? null,
        photoUrl: employee.photoUrl,
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
      select,
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
      photoUrl: employee.photoUrl,
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
      payType: 'daily',
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

export const readAttendanceByDate = async (date: Date) => {
  const presenceData: { date: string; total: number }[] = []
  const absentData: { date: string; total: number }[] = []

  for (let i = 3; i >= 0; i--) {
    const targetDate = subDays(date, i)
    const start = startOfDay(targetDate)
    const end = endOfDay(targetDate)

    const [presence, absent] = await Promise.all([
      db.attendance.count({
        where: {
          deletedAt: null,
          type: 'presence',
          date: {
            gte: start,
            lte: end,
          },
        },
      }),
      db.attendance.count({
        where: {
          deletedAt: null,
          type: 'absent',
          date: {
            gte: start,
            lte: end,
          },
        },
      }),
    ])

    const label = format(targetDate, 'd/M/yyyy', { locale: id })
    presenceData.push({ date: label, total: presence })
    absentData.push({ date: label, total: absent })
  }

  const presencePercentage = calculatePercentage(presenceData)
  const absentPercentage = calculatePercentage(absentData)

  return {
    presence: {
      data: presenceData,
      percentage: presencePercentage,
    },
    absent: {
      data: absentData,
      percentage: absentPercentage,
    },
  }
}

function calculatePercentage(data: { total: number }[]) {
  const today = data.at(-1)?.total ?? 0
  const yesterday = data.at(-2)?.total ?? 0

  if (yesterday === 0) return today > 0 ? 100 : 0

  return Math.round(((today - yesterday) / yesterday) * 100)
}
