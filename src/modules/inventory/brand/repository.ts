import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Brand } from './schema'
import { deleteFile } from '@/utils/file'

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

  if (page === undefined || limit === undefined) {
    const data = await db.brandInventory.findMany({
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
    db.brandInventory.findMany({
      where,
      select,
      orderBy: {
        name: 'desc',
      },
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
