import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Location } from './schema'

const select: Prisma.LocationInventorySelect = {
  id: true,
  name: true,
  _count: {
    select: {
      inventories: true,
    },
  },
}

export const create = async (payload: Location & { photoUrl?: string }) => {
  return db.locationInventory.create({
    data: {
      name: payload.name,
    },
  })
}

export const update = async (
  id: string,
  payload: Location & { createdBy: string; photoUrl?: string },
) => {
  return db.locationInventory.update({
    where: { id },
    data: {
      name: payload.name,
    },
  })
}

export const destroy = async (id: string) => {
  return db.locationInventory.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const data = await db.locationInventory.findUnique({ where: { id }, select })
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
  const where: Prisma.LocationInventoryWhereInput = {
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
    const data = await db.locationInventory.findMany({
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
    db.locationInventory.findMany({
      where,
      select,
      orderBy: {
        name: 'desc',
      },
      skip,
      take,
    }),
    db.locationInventory.count({ where }),
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
  const data = await db.locationInventory.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}
