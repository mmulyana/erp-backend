import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { createRole, updateRole } from './schema'

import { getPaginateParams } from '@/utils/params'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'
import { makePermissionsUnique } from '@/utils/unique'

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
) => {
  const where: Prisma.RoleWhereInput = {
    AND: [search ? { name: { contains: search } } : {}],
  }

  if (page === undefined || limit === undefined) {
    const roles = await db.role.findMany({
      where,
      orderBy: { name: 'asc' },
      // include: {}
    })

    return { data: roles }
  }

  const { skip, take } = getPaginateParams(page, limit)
  const [roles, total] = await Promise.all([
    db.role.findMany({
      skip,
      take,
      where,
      orderBy: { name: 'asc' },
    }),
    db.role.count({ where }),
  ])

  const total_pages = Math.ceil(total / limit)

  return {
    data: roles,
    total,
    page,
    limit,
    total_pages,
  }
}

export const create = async (data: createRole) => {
  return await db.role.create({
    data: {
      name: data.name,
      description: data.description,
    },
  })
}

export const findById = async (id: string) => {
  const role = await db.role.findUnique({ where: { id } })
  if (!role) {
    return throwError(Messages.notFound, HttpStatusCode.NotFound)
  }
}

export const update = async (id: string, data: updateRole) => {
  return await db.role.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      permissions: makePermissionsUnique(data.permissions),
    },
  })
}

export const destroy = async (id: string) => {
  await db.role.delete({ where: { id } })
}

export const findOne = async (id: string) => {
  const data = await db.role.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      permissions: true,
      users: {
        select: {
          id: true,
          username: true,
          email: true,
          photoUrl: true,
        },
      },
    },
  })

  return {
    ...data,
    permissions: data.permissions.split(','),
  }
}
