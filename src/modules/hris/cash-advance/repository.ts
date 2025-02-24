import { z } from 'zod'
import { Prisma } from '@prisma/client'
import db from '@/lib/prisma'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { CashAdvance } from './schema'
import { getPaginateParams } from '@/utils/params'

type MonthlyTotal = {
  month: string
  total: number
}

type ChartConfig = {
  total: {
    label: string
    color: string
  }
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
                  fullname: { contains: search, mode: 'insensitive' }, // Case-insensitive search
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
    const data = await db.cashAdvance.findMany({ where })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.cashAdvance.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: 'asc',
      },
    }),
    db.cashAdvance.count({ where }),
  ])

  // Hitung total halaman
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

export const readTotalInYear = async (totalMonths: number = 12) => {
  const now = new Date()
  const startDate = new Date(
    now.getFullYear(),
    now.getMonth() - (totalMonths - 1),
    1,
  )
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const monthlyTotals = await db.cashAdvance.groupBy({
    by: ['date'],
    _sum: {
      amount: true,
    },
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  })

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ]

  const monthlyMap = new Map<number, number>()

  monthlyTotals.forEach((item) => {
    const date = new Date(item.date)
    const month = date.getMonth()
    const currentTotal = monthlyMap.get(month) || 0
    monthlyMap.set(month, currentTotal + (item._sum.amount || 0))
  })

  const chartData: MonthlyTotal[] = []
  for (let i = 0; i < totalMonths; i++) {
    const monthIndex = (now.getMonth() - (totalMonths - 1) + i + 12) % 12
    chartData.push({
      month: monthNames[monthIndex],
      total: Math.round(monthlyMap.get(monthIndex) || 0),
    })
  }

  const chartConfig = {
    total: {
      label: 'Total',
      color: '#2A9D90',
    },
  } satisfies ChartConfig

  return {
    chartData,
    chartConfig,
  }
}
