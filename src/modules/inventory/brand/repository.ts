import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { deleteFile } from '@/utils/file'
import db from '@/lib/prisma'

import { Brand } from './schema'
import { PaginationParams } from '@/types'

const select: Prisma.BrandInventorySelect = {
  id: true,
  name: true,
  photoUrl: true,

  createdAt: true,

  _count: {
    select: {
      inventories: true,
    },
  },
}

export const create = async (payload: Brand & { photoUrl?: string }) => {
  return db.brandInventory.create({
    data: {
      name: payload.name,
      photoUrl: payload.photoUrl,
    },
  })
}

export const update = async (
  id: string,
  payload: Brand & { createdBy: string; photoUrl?: string },
) => {
  return db.brandInventory.update({
    where: { id },
    data: {
      name: payload.name,
      photoUrl: payload.photoUrl,
    },
  })
}

export const destroy = async (id: string) => {
  return db.brandInventory.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const data = await db.brandInventory.findUnique({
    where: { id },
    select: {
      ...select,
      _count: { select: { inventories: true } },
    },
  })
  return data
}

export const readAll = async ({
  limit,
  page,
  search,
  infinite,
  sortBy,
  sortOrder,
}: PaginationParams & {
  infinite?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.BrandInventoryWhereInput = {
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

  const orderBy: Prisma.BrandInventoryOrderByWithRelationInput = {
    [sortBy || 'createdAt']: sortOrder || 'desc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.brandInventory.findMany({
      select,
      where,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.brandInventory.findMany({
      where,
      select,
      orderBy,
      skip,
      take,
    }),
    db.brandInventory.count({ where }),
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
  const data = await db.brandInventory.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}

export const destroyPhoto = async (id: string) => {
  const data = await db.brandInventory.findUnique({ where: { id } })
  if (data.photoUrl) {
    await deleteFile(data.photoUrl)
  }

  await db.brandInventory.update({ where: { id }, data: { photoUrl: null } })
}
