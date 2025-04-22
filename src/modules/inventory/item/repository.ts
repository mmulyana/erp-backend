import db from '@/lib/prisma'
import { Item } from './schema'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'

const select: Prisma.InventorySelect = {
  id: true,
  name: true,
  description: true,
  minimum: true,
  location: {
    select: {
      id: true,
      name: true,
    },
  },
  brand: {
    select: {
      id: true,
      name: true,
    },
  },
  photoUrl: true,
}

export const create = async (
  payload: Item & { createdBy: string; photoUrl?: string },
) => {
  return db.inventory.create({
    data: {
      name: payload.name,
      createdBy: payload.createdBy,
      minimum: payload.minimum,
      brandId: payload.brandId,
      locationId: payload.locationId,
      description: payload.description,
      photoUrl: payload.photoUrl,
      unitOfMeasurement: payload.unitOfMeasurement,
    },
  })
}

export const update = async (
  id: string,
  payload: Item & { createdBy: string; photoUrl?: string },
) => {
  return db.inventory.update({
    where: { id },
    data: {
      name: payload.name,
      createdBy: payload.createdBy,
      minimum: payload.minimum,
      brandId: payload.brandId,
      locationId: payload.locationId,
      description: payload.description,
      photoUrl: payload.photoUrl,
      unitOfMeasurement: payload.unitOfMeasurement,
    },
  })
}

export const destroy = async (id: string) => {
  return db.inventory.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const data = await db.inventory.findUnique({ where: { id }, select })
  return { data }
}

type readAllParams = {
  page?: number
  limit?: number
  search?: string
}

export const readAll = async ({ limit, page, search }: readAllParams) => {
  const where: Prisma.InventoryWhereInput = {
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
    const data = await db.inventory.findMany({
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
    db.inventory.findMany({
      where,
      select,
      orderBy: {
        name: 'desc',
      },
      skip,
      take,
    }),
    db.inventory.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  return {
    data,
    page,
    limit,
    total_pages,
    total,
  }
}

export const readAllInfinite = async ({ limit, page, search }: readAllParams) => {
  const where: Prisma.InventoryWhereInput = {
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

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.inventory.findMany({
      select,
      where,
      skip,
      take,
      orderBy: {
        name: 'desc',
      },
    }),
    db.inventory.count({ where }),
  ])

  const hasNextPage = page * limit < total

  return {
    data,
    nextPage: hasNextPage ? page + 1 : undefined,
  }
}

export const isExist = async (id: string) => {
  const data = await db.inventory.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}
