import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { Prisma, RefType } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { PaginationParams } from '@/types'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { processTotalPrice } from './helper'
import { StockIn } from './schema'
import { deleteFile } from '@/utils/file'

const select: Prisma.StockInSelect = {
  id: true,
  date: true,
  createdBy: true,
  items: {
    include: {
      item: true,
    },
  },
  note: true,
  photoUrl: true,
  referenceNumber: true,
  supplier: true,
  supplierId: true,
  user: true,
  _count: {
    select: {
      items: true,
    },
  },
}

export const create = async (
  data: StockIn & {
    createdBy: string
    photoUrl?: string
  },
) => {
  return await db.$transaction(async (tx) => {
    // buat stock in dulu
    const stockIn = await tx.stockIn.create({
      data: {
        referenceNumber: data.referenceNumber,
        supplierId:
          data.supplierId && data.supplierId !== ''
            ? data.supplierId
            : undefined,
        note: data.note,
        createdBy: data.createdBy,
        date: data.date,
        photoUrl: data.photoUrl,
      },
    })

    for (const item of data.items) {
      // tambah stock in item
      await tx.stockInItem.create({
        data: {
          stockInId: stockIn.id,
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        },
      })

      // tambah di ledger
      await tx.stockLedger.create({
        data: {
          itemId: item.itemId,
          quantity: item.quantity,
          type: RefType.STOCK_IN,
          date: data.date,
          note: `Stock In: ${data.referenceNumber ?? '-'}`,
          referenceId: stockIn.id,
        },
      })

      // update stock di inventory
      await tx.inventory.update({
        where: { id: item.itemId },
        data: {
          availableStock: {
            increment: item.quantity,
          },
          totalStock: {
            increment: item.quantity,
          },
        },
      })
    }

    return stockIn
  })
}

export const readAll = async ({
  page,
  limit,
  search,
  createdBy,
  supplierId,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: PaginationParams & {
  createdBy?: string
  supplierId?: string
  sortBy?: 'createdAt' | 'date'
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.StockInWhereInput = {
    AND: [
      search ? { note: { contains: search, mode: 'insensitive' } } : {},
      createdBy ? { createdBy } : {},
      supplierId ? { supplierId } : {},
    ],
  }

  const orderBy = {
    [sortBy]: sortOrder,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.stockIn.findMany({
      select,
      where,
      orderBy,
      take: 20,
    })
    return { data: processTotalPrice(data) }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.stockIn.findMany({ where, select, orderBy, skip, take }),
    db.stockIn.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  return {
    data: processTotalPrice(data),
    page,
    limit,
    total_pages,
    total,
  }
}

export const read = async (id: string) => {
  const data = await db.stockIn.findUnique({
    where: { id },
    select: { ...select, photoUrl: true },
  })
  return {
    data: {
      ...data,
      totalPrice: data.items.reduce(
        (sum, item) => sum + item.unitPrice * item.quantity,
        0,
      ),
    },
  }
}

export const update = async (
  id: string,
  payload: Partial<StockIn & { photoUrl?: string }>,
) => {
  const exist = await db.stockIn.findUnique({ where: { id } })
  if (exist.photoUrl !== payload.photoUrl) {
    await deleteFile(exist.photoUrl)
  }

  const data = await db.stockIn.update({
    where: { id },
    data: {
      date: payload.date,
      note: payload.note,
      photoUrl: payload.photoUrl,
      supplierId: payload.supplierId,
      referenceNumber: payload.referenceNumber,
    },
  })
  return data
}

export const isExist = async (id: string) => {
  const data = await db.stockIn.findUnique({ where: { id } })
  if (!data) return throwError(Messages.notFound, HttpStatusCode.BadRequest)
}

export const findTotalByMonth = async ({
  monthIndex,
  year,
}: {
  monthIndex: number // 0 - 11
  year: number
}) => {
  const start = startOfMonth(new Date(year, monthIndex))
  const end = endOfMonth(start)

  const prevStart = startOfMonth(subMonths(start, 1))
  const prevEnd = endOfMonth(prevStart)

  const [currentItems, previousItems] = await Promise.all([
    db.stockInItem.findMany({
      where: {
        stockIn: {
          date: {
            gte: start,
            lte: end,
          },
        },
      },
      select: {
        quantity: true,
        unitPrice: true,
      },
    }),
    db.stockInItem.findMany({
      where: {
        stockIn: {
          date: {
            gte: prevStart,
            lte: prevEnd,
          },
        },
      },
      select: {
        quantity: true,
        unitPrice: true,
      },
    }),
  ])

  const calculateTotal = (items: { quantity: number; unitPrice: number }[]) =>
    items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0)

  const currentTotal = calculateTotal(currentItems)
  const prevTotal = calculateTotal(previousItems)

  const percentage =
    prevTotal === 0 ? 100 : ((currentTotal - prevTotal) / prevTotal) * 100

  return {
    total: currentTotal,
    percentage: Math.round(percentage * 100) / 100,
  }
}
