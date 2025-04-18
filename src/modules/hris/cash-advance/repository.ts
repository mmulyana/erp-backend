import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  subDays,
  getMonth,
} from 'date-fns'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { convertUTCToWIB } from '@/utils/convert-date'
import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { CashAdvance } from './schema'

type MonthlyTotal = {
  month: string
  total: number
}

export type FilterCash = {
  fullname?: string
  startDate?: Date
  endDate?: Date
}

type Payload = CashAdvance & { createdBy: string }

const select: Prisma.CashAdvanceSelect = {
  employee: {
    select: {
      id: true,
      fullname: true,
    },
  },
  amount: true,
  id: true,
  date: true,
  note: true,
  employeeId: true,
}

export const isExist = async (id: string) => {
  const data = await db.cashAdvance.findUnique({ where: { id } })
  if (!data) return throwError(Messages.notFound, HttpStatusCode.BadRequest)
}

export const create = async (payload: Payload) => {
  await db.cashAdvance.create({
    data: {
      employeeId: payload.employeeId,
      amount: payload.amount,
      note: payload.note,
      createdBy: payload.createdBy,
      date: new Date(payload.date).toISOString(),
    },
  })
}

export const update = async (id: string, payload: Payload) => {
  return await db.cashAdvance.update({
    data: {
      ...payload,
      date: new Date(payload.date).toISOString(),
    },
    where: { id },
  })
}

export const destroy = async (id: string) => {
  await db.cashAdvance.delete({ where: { id } })
}

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string,
) => {
  const where: Prisma.CashAdvanceWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                employee: {
                  fullname: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {},
      startDate && endDate
        ? {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }
        : {},
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.cashAdvance.findMany({
      where,
      include: {
        employee: {
          select: {
            fullname: true,
          },
        },
      },
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.cashAdvance.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where,
      skip,
      take,
      include: {
        employee: {
          select: {
            fullname: true,
          },
        },
      },
    }),
    db.cashAdvance.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  const converted = data.map((item) => ({
    ...item,
    date: convertUTCToWIB(item.date),
  }))

  return {
    data: converted,
    total,
    page,
    limit,
    total_pages,
  }
}

export const findOne = async (id: string) => {
  return await db.cashAdvance.findUnique({
    select,
    where: { id },
  })
}

export const totalInYear = async (date: Date) => {
  const currentYearStart = startOfYear(date)
  const currentYearEnd = endOfYear(date)

  const lastYearDate = new Date(date)
  lastYearDate.setFullYear(lastYearDate.getFullYear() - 1)
  const lastYearStart = startOfYear(lastYearDate)
  const lastYearEnd = endOfYear(lastYearDate)

  const [currentYearTotalResult, lastYearTotalResult] = await Promise.all([
    db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: currentYearStart,
          lte: currentYearEnd,
        },
      },
    }),
    db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: lastYearStart,
          lte: lastYearEnd,
        },
      },
    }),
  ])

  const currentTotal = currentYearTotalResult._sum.amount ?? 0
  const lastTotal = lastYearTotalResult._sum.amount ?? 0

  const percentageChange =
    lastTotal === 0
      ? 100
      : Math.round(((currentTotal - lastTotal) / lastTotal) * 100)

  return {
    total: currentTotal,
    lastYear: percentageChange,
  }
}

export const totalInMonth = async (date: Date) => {
  const currentStart = startOfMonth(date)
  const currentEnd = endOfMonth(date)

  const lastMonthDate = subMonths(date, 1)
  const lastMonthStart = startOfMonth(lastMonthDate)
  const lastMonthEnd = endOfMonth(lastMonthDate)

  const [currentResult, lastMonthResult] = await Promise.all([
    db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
    }),
    db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: lastMonthStart,
          lte: lastMonthEnd,
        },
      },
    }),
  ])

  const currentTotal = currentResult._sum.amount ?? 0
  const lastTotal = lastMonthResult._sum.amount ?? 0

  const percentage =
    lastTotal === 0
      ? currentTotal === 0
        ? 0
        : 100
      : Math.round(((currentTotal - lastTotal) / lastTotal) * 100)

  return {
    total: currentTotal,
    lastMonth: percentage,
  }
}

export const totalInDay = async (date: Date) => {
  const currentStart = startOfDay(date)
  const currentEnd = endOfDay(date)

  const lastDayStart = subDays(date, 1)
  const lastDayEnd = endOfDay(lastDayStart)

  const [currentResult, lastMonthResult] = await Promise.all([
    db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: currentStart,
          lte: currentEnd,
        },
      },
    }),
    db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: lastDayStart,
          lte: lastDayEnd,
        },
      },
    }),
  ])

  const currentTotal = currentResult._sum.amount ?? 0
  const lastTotal = lastMonthResult._sum.amount ?? 0

  const percentage =
    lastTotal === 0
      ? currentTotal === 0
        ? 0
        : 100
      : Math.round(((currentTotal - lastTotal) / lastTotal) * 100)

  return {
    total: currentTotal,
    lastDay: percentage,
  }
}

export const reportLastSixMonth = async (date: Date) => {
  const chartData: { month: number; total: number }[] = []

  for (let i = 5; i >= 0; i--) {
    const targetDate = subMonths(date, i)
    const start = startOfMonth(targetDate)
    const end = endOfMonth(targetDate)

    const result = await db.cashAdvance.aggregate({
      _sum: { amount: true },
      where: {
        deletedAt: null,
        date: {
          gte: start,
          lte: end,
        },
      },
    })

    chartData.push({
      month: getMonth(targetDate),
      total: result._sum.amount ?? 0,
    })
  }

  const totalAll = chartData.reduce((acc, cur) => acc + cur.total, 0)
  const mean = Math.round(totalAll / chartData.length)

  return {
    chartData,
    mean,
  }
}

export const reportBiggestByEmployee = async (date: Date) => {
  const start = startOfMonth(date)
  const end = endOfMonth(date)

  const result = await db.cashAdvance.groupBy({
    by: ['employeeId'],
    where: {
      deletedAt: null,
      date: {
        gte: start,
        lte: end,
      },
    },
    _sum: {
      amount: true,
    },
    orderBy: {
      _sum: {
        amount: 'desc',
      },
    },
    take: 5,
  })

  const employeeIds = result.map((r) => r.employeeId)

  const employees = await db.employee.findMany({
    where: {
      id: { in: employeeIds },
    },
    select: {
      id: true,
      fullname: true,
      position: true,
    },
  })

  const data = result.map((r) => {
    const emp = employees.find((e) => e.id === r.employeeId)
    return {
      fullname: emp?.fullname,
      position: emp?.position,
      total: r._sum.amount ?? 0,
    }
  })

  return data
}
