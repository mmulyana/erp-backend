import { Prisma } from '@prisma/client'
import { HttpStatusCode } from 'axios'

import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import db from '@/lib/prisma'

import { CreateGroup, CreatePermission, UpdatePermission } from './schema'

export const findAll = async (search?: string) => {
  const where: Prisma.PermissionGroupWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                name: { contains: search },
              },
              {
                permissions: {
                  some: {
                    name: { contains: search },
                  },
                },
              },
            ],
          }
        : {},
    ],
  }

  const group = await db.permissionGroup.findMany({
    orderBy: {
      name: 'asc',
    },
    where,
    include: {
      permissions: true,
    },
  })
  return group
}

export const findPermissions = async (
  search?: string,
  groupId?: 'none' | number,
) => {
  const where: Prisma.PermissionWhereInput = {
    AND: [
      search
        ? {
            name: { contains: search },
          }
        : {},
      groupId !== undefined
        ? {
            groupId: groupId === 'none' ? null : groupId,
          }
        : {},
    ],
  }

  const permissions = await db.permission.findMany({
    where,
    orderBy: {
      key: 'asc',
    },
  })

  return { permissions }
}

export const findPermissionById = async (key: string) => {
  const data = await db.permission.findUnique({ where: { key } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.NotFound)
  }
}

export const createPermission = async (payload: CreatePermission) => {
  return await db.permission.create({
    data: {
      key: payload.key,
      name: payload.name,
      description: payload.description,
      group: {
        connect: {
          id: payload.groupId,
        },
      },
    },
  })
}

export const updatePermissionRepository = async (
  id: string,
  payload: UpdatePermission,
) => {
  return await db.permission.update({
    where: { key: id },
    data: {
      name: payload.name,
      description: payload.description,
      group: {
        connect: {
          id: payload.groupId,
        },
      },
    },
  })
}

export const destroyPermission = async (id: string) => {
  await findPermissionById(id)

  const data = await db.permissionRole.findMany({
    where: {
      permissionId: id,
    },
  })
  if (data.length > 0) {
    await db.permissionRole.deleteMany({
      where: {
        permissionId: id,
      },
    })
  }

  await db.permission.delete({ where: { key: id } })
}

export const findGroupById = async (id: number) => {
  const data = await db.permissionGroup.findUnique({ where: { id } })
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.NotFound)
  }
}

export const createGroup = async (data: CreateGroup) => {
  return await db.permissionGroup.create({
    data: {
      name: data.name,
      description: data.description,
    },
  })
}

export const destroyGroup = async (id: number) => {
  await db.permissionGroup.delete({ where: { id } })
}

export const updateGroupRepository = async (
  id: number,
  data: UpdatePermission,
) => {
  return await db.permissionGroup.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  })
}
