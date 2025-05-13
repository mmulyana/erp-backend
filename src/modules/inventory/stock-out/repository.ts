import { Prisma, RefType, TransactionType } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import db from '@/lib/prisma'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { processTotalPrice } from '@/utils'
import { PaginationParams } from '@/types'

import { StockOut } from './schema'

const select: Prisma.StockOutSelect = {
  id: true,
  date: true,
  createdBy: true,
  note: true,
  projectId: true,
  project: true,
  user: true,
  photoUrl: true,
  items: {
    include: {
      item: true,
    },
  },
  _count: {
    select: {
      items: true,
    },
  },
}

export const readAll = async ({ page, limit, search }: PaginationParams) => {
  const where: Prisma.StockOutWhereInput = {
    AND: [search ? { note: { contains: search, mode: 'insensitive' } } : {}],
  }

  const orderBy: Prisma.StockOutOrderByWithRelationInput = {
    createdAt: 'desc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.stockOut.findMany({
      select,
      where,
      orderBy,
      take: 20,
    })
    return { data: processTotalPrice(data) }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.stockOut.findMany({ where, select, orderBy, skip, take }),
    db.stockOut.count({ where }),
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
  const data = await db.stockOut.findUnique({
    where: { id },
    select,
  })

  return {
    data: {
      ...data,
      totalPrice: data?.items.reduce(
        (sum, item) =>
          sum + (item.totalPrice ?? item.unitPrice * item.quantity),
        0,
      ),
    },
  }
}

export const create = async (
  data: StockOut & {
    photoUrl?: string
    createdBy: string
  },
) => {
  return db.$transaction(async (tx) => {
    const inventoryMap = await tx.inventory.findMany({
      where: {
        id: {
          in: data.items.map((i) => i.itemId),
        },
      },
      select: {
        id: true,
        availableStock: true,
        name: true,
      },
    })

    const inventoryLookup = Object.fromEntries(
      inventoryMap.map((inv) => [inv.id, inv]),
    )

    // Validasi stok cukup
    for (const item of data.items) {
      const inventory = inventoryLookup[item.itemId]
      if (!inventory) {
        return throwError(
          `Inventory dengan ID ${item.itemId} tidak ditemukan`,
          HttpStatusCode.BadRequest,
        )
      }

      if (item.quantity > inventory.availableStock) {
        throwError(
          `Stok ${inventory.name} tidak mencukupi. Stok tersedia ${inventory.availableStock}`,
          HttpStatusCode.BadRequest,
        )
      }
    }

    // Buat stock out
    const stockOut = await tx.stockOut.create({
      data: {
        note: data.note,
        date: data.date,
        projectId: data.projectId,
        createdBy: data.createdBy,
        photoUrl: data.photoUrl,
      },
    })

    for (const item of data.items) {
      const totalPrice = (item.unitPrice ?? 0) * item.quantity

      // tambah stock out item
      await tx.stockOutItem.create({
        data: {
          stockOutId: stockOut.id,
          itemId: item.itemId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice,
        },
      })

      // tambah di stock ledger
      await tx.stockLedger.create({
        data: {
          inventoryId: item.itemId,
          quantity: item.quantity,
          type: TransactionType.OUT,
          refType: RefType.STOCK_OUT,
          referenceId: stockOut.id,
          note: `Stock out: ${data.note ?? '-'}`,
          date: data.date,
          createdBy: data.createdBy,
        },
      })

      // update stock di inventory
      await tx.inventory.update({
        where: { id: item.itemId },
        data: {
          availableStock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return stockOut
  })
}
