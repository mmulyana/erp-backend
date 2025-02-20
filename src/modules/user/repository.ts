import { HttpStatusCode } from 'axios'

import db from '@/lib/prisma'

import { isValidUUID } from '@/utils/is-valid-uuid'
import { throwError } from '@/utils/error-handler'
import { getPaginateParams } from '@/utils/params'
import { Messages } from '@/utils/constant'

import { CreateAccount, UpdateAccount } from './schema'
import { Prisma } from '@prisma/client'

export const create = async (data: CreateAccount & { password: string }) => {
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
  data: UpdateAccount & {
    deletedAt?: string
    active?: boolean
    photoUrl?: string
    password?: string
  },
) => {
  return await db.user.update({ data, where: { id } })
}

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
  active?: boolean,
  roleId?: string,
) => {
  const where: Prisma.UserWhereInput = {
    AND: [
      search
        ? {
            OR: [
              { username: { contains: search } },
              { email: { contains: search } },
              { phone: { contains: search } },
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
    tours: true,
  }

  if (page === undefined || limit === undefined) {
    const users = await db.user.findMany({
      where,
      orderBy: { username: 'asc' },
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
      orderBy: { username: 'asc' },
      select,
    }),
    db.user.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  return {
    data: users,
    total,
    page,
    limit,
    total_pages,
  }
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

export const findById = async (id: string) => {
  return db.user.findUnique({
    where: { id },
    include: {
      role: {
        include: {
          permissionRole: {
            select: {
              permission: {
                select: {
                  key: true,
                },
              },
            },
          },
        },
      },
      tours: true,
    },
  })
}

export const findRoleById = async (id: string) => {
  if (!isValidUUID(id)) {
    return throwError(Messages.InvalidUUID, HttpStatusCode.NotFound)
  }
  return db.role.findUnique({ where: { id } })
}

export const findTourByIdandKey = async (userId: string, key: string) => {
  return await db.tour.findFirst({
    where: {
      userId,
      key,
    },
  })
}

export const createTour = async (userId: string, key: string) => {
  await db.tour.create({
    data: {
      userId,
      key,
    },
  })
}
