import { HttpStatusCode } from 'axios'
import { Prisma } from '@prisma/client'

import db from '@/lib/prisma'

import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'

import { Account } from './schema'
import { PaginationParams } from '@/types'

export const create = async (data: Account) => {
  const userData: Prisma.UserCreateInput = {
    username: data.username,
    email: data.email,
    password: data.password,
  }

  if (data.roleId) {
    userData.role = {
      connect: {
        id: data.roleId,
      },
    }
  }

  return await db.user.create({
    data: userData,
  })
}

export const update = async (
  id: string,
  data: Account & {
    photoUrl?: string
    password?: string
  },
) => {
  if (data.roleId === '') {
    delete data.roleId
  }
  return await db.user.update({ data, where: { id } })
}

export const findAll = async ({
  active,
  infinite,
  limit,
  page,
  roleId,
  search,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: PaginationParams & {
  active?: boolean
  roleId?: string
  infinite?: boolean
  sortBy?: 'username' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}) => {
  const where: Prisma.UserWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { username: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      active !== undefined ? { active } : {},
      roleId ? { roleId } : {},
      { deletedAt: null },
    ],
  }

  const select: Prisma.UserSelect = {
    active: true,
    id: true,
    username: true,
    email: true,
    phone: true,
    photoUrl: true,
    role: true,
  }

  const orderBy = { [sortBy]: sortOrder }

  if (page === undefined || limit === undefined) {
    const users = await db.user.findMany({
      where,
      orderBy,
      select,
    })

    return { data: users }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [users, total] = await Promise.all([
    db.user.findMany({
      skip,
      take,
      where,
      orderBy,
      select,
    }),
    db.user.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)
  const hasNextPage = page * limit < total

  if (infinite) {
    return {
      data: users,
      nextPage: hasNextPage ? page + 1 : undefined,
    }
  }

  return {
    data: users,
    total,
    page,
    limit,
    total_pages,
  }
}
export const find = async (id: string) => {
  const data = await db.user.findUnique({
    where: { id },
    include: {
      role: true,
    },
  })
  delete data.password
  return { data }
}

export const findByEmail = async (email: string) => {
  return db.user.findUnique({ where: { email } })
}

export const findByUsername = async (username: string) => {
  return db.user.findUnique({ where: { username } })
}

export const findByPhone = async (phone: string) => {
  return db.user.findUnique({ where: { phone } })
}

export const isExist = async (id: string) => {
  const data = await db.user.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.BadGateway)
  }
}

export const destroy = async (id: string) => {
  await db.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  })
}
