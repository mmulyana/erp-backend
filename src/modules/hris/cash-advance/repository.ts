import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  setDate,
  subMonths,
} from 'date-fns'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { convertUTCToWIB } from '@/utils/convert-date'
import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { CashAdvance, CashAdvanceTransaction } from './schema'
import { checkRemaining, recalculateRemaining, updateStatus } from './helper'

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
      position: true,
    },
  },
  amount: true,
  id: true,
  date: true,
  note: true,
  employeeId: true,
  status: true,
}

export const isExist = async (id: string) => {
  const data = await db.cashAdvance.findUnique({ where: { id } })
  if (!data || data.deletedAt !== null)
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
}
export const isTransactionExist = async (id: string) => {
  const data = await db.cashAdvanceTransaction.findUnique({ where: { id } })
  if (!data || data.deletedAt !== null)
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
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
      { deletedAt: null },
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.cashAdvance.findMany({
      where,
      select,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.cashAdvance.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where,
      skip,
      take,
      select,
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

export const findTotalByMonth = async (year: number, monthIndex: number) => {
  const currentMonthStart = startOfMonth(new Date(year, monthIndex))
  const currentMonthEnd = endOfMonth(currentMonthStart)

  const previousMonthStart = startOfMonth(subMonths(currentMonthStart, 1))
  const previousMonthEnd = endOfMonth(previousMonthStart)

  const [current, previous] = await Promise.all([
    db.cashAdvance.aggregate({
      where: {
        deletedAt: null,
        date: {
          gte: currentMonthStart,
          lte: currentMonthEnd,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    db.cashAdvance.aggregate({
      where: {
        deletedAt: null,
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
      },
      _sum: {
        amount: true,
      },
    }),
  ])

  const totalAmount = current._sum.amount ?? 0
  const prevAmount = previous._sum.amount ?? 0

  const percentage =
    prevAmount === 0
      ? totalAmount > 0
        ? 100
        : 0
      : Math.round(((totalAmount - prevAmount) / prevAmount) * 100)

  return {
    totalAmount,
    percentage,
  }
}

// transaction
export const createTransaction = async (data: CashAdvanceTransaction) => {
  await checkRemaining(data.cashAdvanceId, data.amount)

  await db.cashAdvanceTransaction.create({
    data: {
      amount: data.amount,
      cashAdvanceId: data.cashAdvanceId,
      date: new Date(data.date),
      note: data.note,
    },
  })

  const remaining = await recalculateRemaining(data.cashAdvanceId)
  await updateStatus(data.cashAdvanceId, remaining)
}
export const updateTransaction = async (
  id: string,
  data: CashAdvanceTransaction,
) => {
  await db.cashAdvanceTransaction.update({
    where: { id },
    data: {
      amount: data.amount,
      cashAdvanceId: data.cashAdvanceId,
      date: new Date(data.date),
      note: data.note,
    },
  })

  const remaining = await recalculateRemaining(data.cashAdvanceId)
  await updateStatus(data.cashAdvanceId, remaining)
}
export const destroyTransaction = async (id: string) => {
  const data = await db.cashAdvanceTransaction.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })

  const remaining = await recalculateRemaining(data.cashAdvanceId)
  await updateStatus(data.cashAdvanceId, remaining)
}

export const findAllTransaction = async (
  page?: number,
  limit?: number,
  search?: string,
  startDate?: string,
  endDate?: string,
  cashAdvanceId?: string,
) => {
  const where: Prisma.CashAdvanceTransactionWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                note: { contains: search, mode: 'insensitive' },
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
      { deletedAt: null, cashAdvanceId },
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.cashAdvanceTransaction.findMany({
      where,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.cashAdvanceTransaction.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where,
      skip,
      take,
    }),
    db.cashAdvanceTransaction.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  const allTx = await db.cashAdvanceTransaction.findMany({
    where,
    orderBy: { createdAt: 'asc' },
  })

  const cashAdvance = await db.cashAdvance.findUnique({
    where: { id: cashAdvanceId ?? '' },
    select: { amount: true },
  })

  let runningRemaining = cashAdvance?.amount ?? 0
  const remainingMap = new Map<string, number>()

  for (const tx of allTx) {
    runningRemaining -= tx.amount
    remainingMap.set(tx.id, runningRemaining)
  }

  const converted = data.map((item) => ({
    ...item,
    remaining: remainingMap.get(item.id) ?? null,
  }))

  return {
    data: converted,
    total,
    page,
    limit,
    total_pages,
  }
}

export const findOneTransaction = async (id: string) => {
  return await db.cashAdvanceTransaction.findUnique({
    select,
    where: { id },
  })
}
