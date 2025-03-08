import { deleteFile } from '@/utils/file'
import db from '@/lib/prisma'

import { Company } from './schema'
import { throwError } from '@/utils/error-handler'
import { HttpStatusCode } from 'axios'
import { Prisma } from '@prisma/client'
import { getPaginateParams } from '@/utils/params'

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
  if (data.photoUrl) {
    const data = await db.companyClient.findUnique({ where: { id } })
    if (data?.photoUrl) {
      deleteFile(data.photoUrl)
    }
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

type Params = {
  page?: number
  limit?: number
  search?: string
}
export const readAll = async ({ page, limit, search }: Params) => {
  const where: Prisma.CompanyClientWhereInput = {
    AND: [search !== undefined ? { name: { contains: search } } : {}],
  }

  const include = {
    employees: true,
  }

  if (page === undefined || limit === undefined) {
    const data = await db.companyClient.findMany({
      where,
      include,
    })
    return { data }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [data, total] = await Promise.all([
    db.companyClient.findMany({
      skip,
      take,
      where,
      orderBy: {
        name: 'asc',
      },
    }),
    db.companyClient.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
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
