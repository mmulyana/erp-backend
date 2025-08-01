import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'

import { Client } from './schema'

import db from '@/lib/prisma'
import { PaginationParams } from '@/types'

type Params = PaginationParams & {
  companyId?: string
  infinite?: boolean
}

export const isExist = async (id: string) => {
  const data = await db.client.findUnique({ where: { id } })
  if (!data) {
    return throwError('Klien tidak ditemukan', HttpStatusCode.BadRequest)
  }
}

export const create = async (payload: Client) => {
  return await db.client.create({
    data: {
      name: payload.name,
      companyId: payload.companyId,
      email: payload.email,
      phone: payload.phone,
      position: payload.position,
    },
  })
}

export const update = async (id: string, payload: Client) => {
  return await db.client.update({
    data: {
      name: payload.name,
      companyId: payload.companyId,
      email: payload.email,
      phone: payload.phone,
      position: payload.position,
    },
    where: { id },
  })
}

export const destroy = async (id: string) => {
  await db.client.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const readAll = async ({
  page,
  limit,
  search,
  companyId,
  infinite,
  sortOrder,
}: Params & {
  sortOrder?: 'asc' | 'desc'
}) => {
  let where: Prisma.ClientWhereInput = {
    AND: [
      search !== undefined
        ? {
            name: { contains: search },
          }
        : {},
      companyId !== undefined ? { companyId } : {},
      { deletedAt: null },
    ],
  }

  const select: Prisma.ClientSelect = {
    id: true,
    name: true,
    position: true,
    email: true,
    phone: true,
    company: {
      select: {
        id: true,
        name: true,
        photoUrl: true,
      },
    },
    _count: {
      select: {
        project: {
          where: {
            deletedAt: null,
          },
        },
      },
    },
  }

  const orderBy = {
    createdAt: sortOrder ?? 'desc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.client.findMany({
      where,
      select,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.client.findMany({
      skip,
      take,
      where,
      select,
      orderBy,
    }),
    db.client.count({ where }),
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
    total,
    page,
    limit,
    total_pages,
  }
}

export const read = async (id: string) => {
  return await db.client.findUnique({
    where: { id },
    include: { company: true },
  })
}

export const readClientRank = async ({
  limit = 10,
  sortOrder = 'desc',
}: {
  limit?: number
  sortOrder: 'asc' | 'desc'
}) => {
  const data = await db.client.findMany({
    select: {
      id: true,
      name: true,
      position: true,
      company: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          project: { where: { deletedAt: null } },
        },
      },
    },
    orderBy: {
      project: { _count: sortOrder },
    },
    take: limit,
  })

  return data
}
