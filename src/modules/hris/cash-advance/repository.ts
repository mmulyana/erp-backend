import { startOfDay, endOfDay, subDays } from 'date-fns'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { convertUTCToWIB } from '@/utils/convert-date'
import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { CashAdvance, CashAdvanceTransaction } from './schema'
import { recalculateRemaining, updateStatus } from './helper'

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
        createdAt: 'desc',
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

export const createTransaction = async (data: CashAdvanceTransaction) => {
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
      { deletedAt: null },
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
        createdAt: 'desc',
      },
      where,
      skip,
      take,
    }),
    db.cashAdvanceTransaction.count({ where }),
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

export const findOneTransaction = async (id: string) => {
  return await db.cashAdvanceTransaction.findUnique({
    select,
    where: { id },
  })
}
