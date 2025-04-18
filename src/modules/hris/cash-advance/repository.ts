import {
  startOfYear,
  endOfYear,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfDay,
  endOfDay,
  subDays,
} from 'date-fns'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

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

  return {
    data,
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

export const readTotal = async () => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const totalAmount = await db.cashAdvance.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  })

  return { total: totalAmount._sum.amount || 0 }
}

// export const readTotalInYear = async (totalMonths: number = 12) => {
//   const now = new Date()
//   const startDate = new Date(
//     now.getFullYear(),
//     now.getMonth() - (totalMonths - 1),
//     1,
//   )
//   const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

//   const monthlyTotals = await db.cashAdvance.groupBy({
//     by: ['date'],
//     _sum: {
//       amount: true,
//     },
//     where: {
//       date: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//   })

//   const monthNames = [
//     'Januari',
//     'Februari',
//     'Maret',
//     'April',
//     'Mei',
//     'Juni',
//     'Juli',
//     'Agustus',
//     'September',
//     'Oktober',
//     'November',
//     'Desember',
//   ]

//   const monthlyMap = new Map<number, number>()

//   monthlyTotals.forEach((item) => {
//     const date = new Date(item.date)
//     const month = date.getMonth()
//     const currentTotal = monthlyMap.get(month) || 0
//     monthlyMap.set(month, currentTotal + (item._sum.amount || 0))
//   })

//   const chartData: MonthlyTotal[] = []
//   for (let i = 0; i < totalMonths; i++) {
//     const monthIndex = (now.getMonth() - (totalMonths - 1) + i + 12) % 12
//     chartData.push({
//       month: monthNames[monthIndex],
//       total: Math.round(monthlyMap.get(monthIndex) || 0),
//     })
//   }

//   const chartConfig = {
//     total: {
//       label: 'Total',
//       color: '#2A9D90',
//     },
//   } satisfies ChartConfig

//   return {
//     chartData,
//     chartConfig,
//   }
// }

export const readTotalInYear = async (date: Date) => {
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

export const ReadTotalInMonth = async (date: Date) => {
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

export const ReadTotalInDay = async (date: Date) => {
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
