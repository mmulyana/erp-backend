import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Location } from './schema'

const select: Prisma.WarehouseSelect = {
  id: true,
  name: true,
  _count: {
    select: {
      inventories: true,
    },
  },
  createdAt: true,
}

export const create = async (payload: Location & { photoUrl?: string }) => {
  return db.warehouse.create({
    data: {
      name: payload.name,
    },
  })
}

export const update = async (
  id: string,
  payload: Location & { createdBy: string; photoUrl?: string },
) => {
  return db.warehouse.update({
    where: { id },
    data: {
      name: payload.name,
    },
  })
}

export const destroy = async (id: string) => {
  return db.warehouse.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const data = await db.warehouse.findUnique({
    where: { id },
    select: {
      ...select,
      inventories: {
        include: { brand: true },
      },
    },
  })
  return { data }
}

type readAllParams = {
  page?: number
  limit?: number
  search?: string
  infinite?: boolean
}

export const readAll = async ({
  limit,
  page,
  search,
  infinite,
}: readAllParams) => {
  const where: Prisma.WarehouseWhereInput = {
    AND: [
      search
        ? {
            name: { contains: search, mode: 'insensitive' },
          }
        : {},
      {
        deletedAt: null,
      },
    ],
  }

  if (page === undefined || limit === undefined) {
    const data = await db.warehouse.findMany({
      select,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [data, total] = await Promise.all([
    db.warehouse.findMany({
      where,
      select,
      orderBy: {
        name: 'desc',
      },
      skip,
      take,
    }),
    db.warehouse.count({ where }),
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

export const isExist = async (id: string) => {
  const data = await db.warehouse.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const readTotal = async () => {
  return db.warehouse.count({ where: { deletedAt: null } })
}
