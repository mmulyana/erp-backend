import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { PaginationParams } from '@/types'
import { deleteFile } from '@/utils/file'
import db from '@/lib/prisma'

import { Company } from './schema'

type Payload = Company & { photoUrl?: string }

export const create = async (payload: Payload) => {
  await db.companyClient.create({
    data: {
      name: payload.name,
      address: payload.address,
      email: payload.email,
      phone: payload.phone,
      photoUrl: payload.photoUrl,
    },
  })
}

export const update = async (id: string, data: Payload) => {
  const exist = await db.companyClient.findUnique({ where: { id } })
  if (exist.photoUrl !== data.photoUrl) {
    await deleteFile(exist.photoUrl)
  }

  return await db.companyClient.update({
    data,
    where: { id },
  })
}

export const destroy = async (id: string) => {
  const data = await db.companyClient.findUnique({ where: { id } })
  if (data?.photoUrl) {
    deleteFile(data.photoUrl)
  }
  await db.companyClient.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}

export const read = async (id: string) => {
  return await db.companyClient.findUnique({
    where: { id },
    include: { employees: true },
  })
}

export const readAll = async ({
  page,
  limit,
  search,
  infinite,
  sortOrder,
}: PaginationParams & {
  infinite?: boolean
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.CompanyClientWhereInput = {
    AND: [
      search !== undefined ? { name: { contains: search } } : {},
      {
        deletedAt: null,
      },
    ],
  }

  const include = {
    employees: true,
  }

  const orderBy = {
    createdAt: sortOrder ?? 'asc',
  }

  if (page === undefined || limit === undefined) {
    const data = await db.companyClient.findMany({
      where,
      include,
      orderBy,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.companyClient.findMany({
      skip,
      take,
      where,
      orderBy,
      select: {
        _count: {
          select: {
            employees: true,
          },
        },
        id: true,
        name: true,
        email: true,
        address: true,
        phone: true,
        photoUrl: true,
      },
    }),
    db.companyClient.count({ where }),
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

export const isExist = async (id: string) => {
  const data = await db.companyClient.findUnique({ where: { id } })
  if (!data) {
    return throwError('Data tidak ditemukan', HttpStatusCode.BadRequest)
  }
}
