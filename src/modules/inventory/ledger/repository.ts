import { Prisma, RefType } from '@prisma/client'
import { id } from 'date-fns/locale'
import {
  eachDayOfInterval,
  endOfDay,
  format,
  formatISO,
  startOfDay,
} from 'date-fns'

import { DateRangeParams, PaginationParams } from '@/types'
import { getPaginateParams } from '@/utils/params'
import db from '@/lib/prisma'

export const readChart = async ({ startDate, endDate }: DateRangeParams) => {
  const start = startOfDay(startDate)
  const end = endOfDay(endDate)

  const raw = await db.$queryRawUnsafe<any[]>(`
    SELECT
      DATE("date") AS date,
      COUNT(*) FILTER (WHERE "type" = 'STOCK_IN') AS stock_in,
      COUNT(*) FILTER (WHERE "type" = 'STOCK_OUT') AS stock_out,
      COUNT(*) FILTER (WHERE "type" = 'LOAN') AS loan
    FROM "stock_ledgers"
    WHERE "date" BETWEEN '${start.toISOString()}' AND '${end.toISOString()}'
    GROUP BY DATE("date")
    ORDER BY DATE("date")
  `)

  const map = new Map<
    string,
    { stock_in: number; stock_out: number; loan: number }
  >()

  for (const row of raw) {
    const key = formatISO(new Date(row.date), { representation: 'date' })
    map.set(key, {
      stock_in: Number(row.stock_in),
      stock_out: Number(row.stock_out),
      loan: Number(row.loan),
    })
  }

  const allDates = eachDayOfInterval({ start, end })

  return allDates.map((date) => {
    const key = formatISO(date, { representation: 'date' })
    const values = map.get(key) ?? { stock_in: 0, stock_out: 0, loan: 0 }

    return {
      date: format(date, 'd MMM', { locale: id }),
      ...values,
    }
  })
}

export const readTable = async ({
  startDate,
  endDate,
  limit,
  page,
  search,
}: DateRangeParams & PaginationParams) => {
  const where: Prisma.StockLedgerWhereInput = {
    AND: [
      search
        ? {
            note: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : {},
      startDate && endDate
        ? {
            date: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {},
    ],
  }
  const select: Prisma.StockLedgerSelect = {
    id: true,
    createdAt: true,
    date: true,
    inventory: {
      select: {
        id: true,
        name: true,
        photoUrl: true,
      },
    },
    itemId: true,
    note: true,
    quantity: true,
    referenceId: true,
    type: true,
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.stockLedger.findMany({
      where,
      select,
      skip,
      take,
    }),
    db.stockLedger.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  return { data, page, limit, total_pages, total }
}

export const readAll = async ({
  limit,
  page,
  search,
  itemId,
  sortOrder,
  sortBy,
  type,
}: PaginationParams & {
  itemId?: string
  sortBy?: 'date' | 'createdAt'
  sortOrder?: 'desc' | 'asc'
  type?: RefType
}) => {
  const where: Prisma.StockLedgerWhereInput = {
    AND: [
      search
        ? {
            inventory: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          }
        : {},
      itemId ? { itemId } : {},
      type === 'LOAN'
        ? {
            type: {
              in: ['LOAN', 'RETURNED'],
            },
          }
        : type
          ? { type }
          : {},
    ],
  }

  const select: Prisma.StockLedgerSelect = {
    id: true,
    inventory: {
      select: {
        id: true,
        name: true,
        photoUrl: true,
      },
    },
    createdAt: true,
    date: true,
    itemId: true,
    note: true,
    quantity: true,
    referenceId: true,
    type: true,
  }

  const orderBy: Prisma.StockLedgerOrderByWithAggregationInput = {
    [sortBy || 'createdAt']: sortOrder || 'desc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.stockLedger.findMany({
      select,
      where,
      orderBy,
    })

    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [data, total] = await Promise.all([
    db.stockLedger.findMany({
      where,
      select,
      orderBy,
      skip,
      take,
    }),
    db.stockLedger.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  const hasNextPage = page * limit < total

  return {
    data,
    page,
    limit,
    total_pages,
    total,
  }
}
