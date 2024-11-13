import { Prisma } from '@prisma/client'
import db from '../../lib/db'

export default class RoleRepository {
  getAll = async () => {
    return await db.role.findMany({
      include: {
        RolePermission: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    })
  }
  getById = async (id: number) => {
    return await db.role.findUnique({
      where: { id },
      include: {
        RolePermission: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
    })
  }
  updateById = async (id: number, data: Prisma.RoleUpdateInput) => {
    return await db.role.update({ where: { id }, data })
  }
  create = async (data: Prisma.RoleCreateInput) => {
    return await db.role.create({ data })
  }
  deleteById = async (id: number) => {
    return await db.role.delete({ where: { id } })
  }
  getPermissionById = async (id: number) => {
    return await db.permission.findUnique({ where: { id } })
  }
  createPermissionRole = async (data: {
    roleId: number
    permissionId: number
  }) => {
    return await db.rolePermission.create({ data })
  }
  deletePermissionRole = async (roleId: number, permissionId: number) => {
    return await db.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId
        }
      },
    })
  }
}
