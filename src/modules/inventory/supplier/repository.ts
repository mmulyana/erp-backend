import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { Supplier } from './schema'

const select: Prisma.SupplierSelect = {
  id: true,
  name: true,
  photoUrl: true,
  address: true,
  phone: true,
  googleMapUrl: true,
  email: true,

  createdAt: true,
}

export const create = async (payload: Supplier & { photoUrl?: string }) => {
  return db.supplier.create({
    data: {
      name: payload.name,
      photoUrl: payload.photoUrl,
      address: payload.address,
      email: payload.email,
      phone: payload.phone,
      googleMapUrl: payload.googleMapUrl,
    },
  })
}

export const update = async (
  id: string,
  payload: Supplier & { photoUrl?: string },
) => {
  return db.supplier.update({
    where: { id },
    data: {
      name: payload.name,
      photoUrl: payload.photoUrl,
      address: payload.address,
      email: payload.email,
      phone: payload.phone,
      googleMapUrl: payload.googleMapUrl,
    },
  })
}

export const destroy = async (id: string) => {
  return db.supplier.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  const data = await db.supplier.findUnique({
    where: { id },
    select: {
      ...select,
      stockIn: {
        select: {
          id: true,
          date: true,
          user: true,
          photoUrl: true,
        },
      },
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
  const where: Prisma.SupplierWhereInput = {
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
    const data = await db.supplier.findMany({
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
    db.supplier.findMany({
      where,
      select,
      orderBy: {
        name: 'desc',
      },
      skip,
      take,
    }),
    db.supplier.count({ where }),
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
  const data = await db.supplier.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }
}
