import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'
import { id } from 'date-fns/locale'
import {
  eachDayOfInterval,
  endOfDay,
  startOfDay,
  formatISO,
  subDays,
  format,
} from 'date-fns'

import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Overtime } from './schema'
import { OrderByParams, PaginationParams } from '@/types'
import { generateData } from './helper'

type Payload = Overtime & { createdBy: string }

export const create = async (payload: Payload) => {
  const existing = await db.overtime.findMany({
    where: {
      employeeId: payload.employeeId,
      date: new Date(payload.date),
      deletedAt: null,
    },
  })
  if (existing.length > 0) {
    return throwError(
      `Anda hanya dapat memasukan data lembur pegawai satu kali pada tanggal ${new Date(payload.date).getDate()}`,
      HttpStatusCode.BadRequest,
    )
  }

  return await db.overtime.create({
    data: {
      employeeId: payload.employeeId,
      totalHour: payload.totalHour,
      createdBy: payload.createdBy,
      note: payload.note,
      date: new Date(payload.date),
      projectId: payload.projectId !== '' ? payload.projectId : undefined,
    },
  })
}

export const update = async (id: string, payload: Payload) => {
  await db.overtime.update({
    data: {
      employeeId: payload.employeeId,
      totalHour: payload.totalHour,
      createdBy: payload.createdBy,
      projectId: payload.projectId,
      note: payload.note,
      ...(payload.date ? { date: new Date(payload.date) } : undefined),
    },
    where: { id },
  })
}

export const destroy = async (id: string) => {
  await db.overtime.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const findAll = async ({
  page,
  limit,
  search,
  startDate,
  position,
  projectId,
  sortBy,
  sortOrder,
}: PaginationParams &
  OrderByParams & {
    startDate?: Date
    projectId?: string
    position?: string
  }) => {
  const where: Prisma.OvertimeWhereInput = {
    date: startDate,
    deletedAt: null,
    employee: {
      // deletedAt: null,
      ...(search && {
        AND: [
          {
            OR: [{ fullname: { contains: search, mode: 'insensitive' } }],
          },
        ],
      }),
    },
  }

  if (position) {
    where.employee.position = {
      contains: position,
      mode: 'insensitive',
    }
  }

  if (projectId) {
    where.projectId = projectId
  }

  const orderBy: Prisma.OvertimeOrderByWithRelationInput = {
    [sortBy ?? 'createdAt']: sortOrder ?? 'desc',
  }

  const select: Prisma.OvertimeSelect = {
    id: true,
    totalHour: true,
    note: true,
    deletedAt: true,
    employee: {
      select: {
        fullname: true,
        position: true,
        photoUrl: true,
        id: true,
      },
    },
    projectId: true,
    project: {
      select: {
        id: true,
        name: true,
      },
    },
  }

  if (page === undefined || limit === undefined) {
    const rawData = await db.overtime.findMany({
      where,
      select,
      orderBy,
    })
    const data = rawData.map((item) => ({
      ...generateData(item),
      employeeId: item.employeeId,
    }))

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [rawData, total] = await Promise.all([
    db.overtime.findMany({
      skip,
      take,
      where,
      select,
      orderBy,
    }),
    db.overtime.count({ where }),
  ])

  const data = rawData.map((item) => ({
    ...generateData(item),
    employeeId: item.employeeId,
  }))

  const total_pages = Math.ceil(total / limit)

  return {
    data,
    total,
    page,
    limit,
    total_pages,
  }
}

export const findOne = async (id: string) => {
  const select: Prisma.OvertimeSelect = {
    id: true,
    note: true,
    date: true,
    totalHour: true,
    projectId: true,
    employee: {
      select: {
        fullname: true,
        position: true,
        id: true,
      },
    },
  }

  return await db.overtime.findUnique({ where: { id }, select })
}

export const isExist = async (id: string) => {
  const data = await db.overtime.findUnique({ where: { id, deletedAt: null } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

type ChartParams = {
  startDate?: Date
  endDate?: Date
}

export const readOvertimeChart = async ({
  startDate,
  endDate,
}: ChartParams) => {
  const today = new Date()
  const start = startDate
    ? startOfDay(new Date(startDate))
    : startOfDay(subDays(today, 6))
  const end = endDate ? endOfDay(new Date(endDate)) : endOfDay(today)

  const allDates = eachDayOfInterval({ start, end })

  const raw = await db.overtime.findMany({
    where: {
      date: { gte: start, lte: end },
      deletedAt: null,
    },
    select: {
      date: true,
    },
  })

  const map = new Map<string, number>()

  for (const item of raw) {
    const key = formatISO(item.date, { representation: 'date' })
    map.set(key, (map.get(key) ?? 0) + 1)
  }

  const result = allDates.map((date) => {
    const key = formatISO(date, { representation: 'date' })
    return {
      date: key,
      total: map.get(key) ?? 0,
    }
  })

  return result
}

export const readOvertimeByDate = async (date: Date) => {
  const result: { date: string; total: number }[] = []

  for (let i = 3; i >= 0; i--) {
    const target = subDays(date, i)
    const start = startOfDay(target)
    const end = endOfDay(target)

    const total = await db.overtime.count({
      where: {
        deletedAt: null,
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    result.push({
      date: format(target, 'd/M/yyyy', { locale: id }),
      total,
    })
  }

  const today = result.at(-1)?.total ?? 0
  const yesterday = result.at(-2)?.total ?? 0

  const percentage =
    yesterday === 0
      ? today > 0
        ? 100
        : 0
      : Math.round(((today - yesterday) / yesterday) * 100)

  return {
    data: result,
    percentage,
  }
}
