import { endOfMonth, startOfMonth } from 'date-fns'
import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { PaginationParams } from '@/types'
import db from '@/lib/prisma'

import { checkPhotoUrlIn } from './helper'
import { Loan } from './schema'

const select: Prisma.LoanSelect = {
  id: true,
  inventoryId: true,
  borrowerId: true,
  requestQuantity: true,
  returnedQuantity: true,
  requestDate: true,
  returnDate: true,
  note: true,
  status: true,
  photoUrlOut: true,
  photoUrlIn: true,
  projectId: true,
  item: {
    select: {
      id: true,
      name: true,
      photoUrl: true,
    },
  },
  borrower: {
    select: {
      id: true,
      username: true,
      photoUrl: true,
    },
  },
  project: {
    select: {
      id: true,
      name: true,
    },
  },
}

export const readAll = async ({
  page,
  limit,
  search,
  infinite,
  status,
  projectId,
  inventoryId,
  borrowerId,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: PaginationParams & {
  infinite?: boolean
  status?: Prisma.EnumLoanStatusFilter
  projectId?: string
  inventoryId?: string
  borrowerId?: string
  sortBy?: 'createdAt' | 'requestDate' | 'returnedDate'
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.LoanWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { note: { contains: search, mode: 'insensitive' } },
              { item: { name: { contains: search, mode: 'insensitive' } } },
              {
                borrower: {
                  username: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {},
      status ? { status } : {},
      projectId ? { projectId } : {},
      inventoryId ? { inventoryId } : {},
      borrowerId ? { borrowerId } : {},
    ],
  }

  const orderBy = { [sortBy]: sortOrder }

  if (page === undefined || limit === undefined) {
    const data = await db.loan.findMany({
      select,
      where,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.loan.findMany({
      where,
      select,
      orderBy,
      skip,
      take,
    }),
    db.loan.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  const hasNextPage = page * limit < total

  if (infinite) {
    return {
      data,
      nextPage: hasNextPage ? page + 1 : undefined,
    }
  }

  return {
    data,
    page,
    limit,
    total_pages,
    total,
  }
}

export const read = async (id: string) => {
  const data = await db.loan.findUnique({ where: { id }, select })
  return data
}

export const create = async (payload: Loan & { borrowerId: string }) => {
  return db.$transaction(async (tx) => {
    const inventory = await tx.inventory.findUnique({
      where: { id: payload.inventoryId },
      select: { availableStock: true },
    })

    if (!inventory) {
      return throwError('Barang tidak ada', HttpStatusCode.BadRequest)
    }

    if (inventory.availableStock < payload.requestQuantity) {
      return throwError('Stok tidak tercukupi', HttpStatusCode.BadRequest)
    }

    const loan = await tx.loan.create({
      data: {
        requestDate: payload.requestDate,
        inventoryId: payload.inventoryId,
        borrowerId: payload.borrowerId,
        projectId: payload.projectId,
        requestQuantity: payload.requestQuantity,
        photoUrlIn: payload.photoUrlIn,
      },
    })

    await tx.inventory.update({
      where: { id: payload.inventoryId },
      data: {
        availableStock: {
          decrement: payload.requestQuantity,
        },
      },
    })

    await tx.stockLedger.create({
      data: {
        itemId: payload.inventoryId,
        type: 'LOAN',
        referenceId: loan.id,
        quantity: payload.requestQuantity,
        date: payload.requestDate,
        note: 'Loan request',
      },
    })

    return loan
  })
}

export const update = async (id: string, payload: Partial<Loan>) => {
  await checkPhotoUrlIn(id, payload.photoUrlIn)
  return db.loan.update({
    where: { id },
    data: payload,
  })
}

export const isExist = async (id: string) => {
  const data = await db.loan.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const findStatusByMonth = async ({
  monthIndex,
  year,
}: {
  monthIndex: number // ingat index bulan 0-11
  year: number
}) => {
  const start = startOfMonth(new Date(year, monthIndex, 1))
  const end = endOfMonth(start)

  const result = await db.loan.groupBy({
    by: ['status'],
    where: {
      requestDate: {
        gte: start,
        lte: end,
      },
    },
    _count: {
      _all: true,
    },
  })

  const option: Record<string, { fill: string; name: string }> = {
    LOANED: {
      fill: '#EE682F',
      name: 'Dipinjam',
    },
    RETURNED: {
      fill: '#475DEF',
      name: 'Dikembalikan',
    },
    PARTIAL_RETURNED: { fill: '#D52B42', name: 'Belum lengkap' },
  }

  return result.map((item) => ({
    name: option[item.status].name,
    total: item._count._all,
    fill: option[item.status].fill,
  }))
}
