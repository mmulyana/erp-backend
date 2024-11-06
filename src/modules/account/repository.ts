import { Prisma } from '@prisma/client'
import db from '../../lib/db'
import { CreateAccountDto } from './service'

export default class AccountRepository {
  getAccountById = async (id: number) => {
    return await db.user.findUnique({
      where: { id },
      include: {
        employee: true,
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
        UserPermission: {
          include: {
            permission: true,
          },
        },
      },
    })
  }

  updateAccountById = async (id: number, data: Prisma.UserUpdateInput) => {
    return await db.user.update({ where: { id }, data })
  }

  deleteAccountById = async (id: number) => {
    return await db.user.delete({ where: { id } })
  }

  createAccount = async (data: CreateAccountDto) => {
    const roleId = data.roleId ? Number(data.roleId) : undefined

    return await db.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        phoneNumber: data.phoneNumber,
        employeeId: data.employeeId,
        photo: data.photo,
        roleId: roleId,
      },
      include: {
        employee: true,
        role: true,
        UserPermission: {
          include: {
            permission: true,
          },
        },
      },
    })
  }

  updateRoleAccount = async (id: number, roleId: number) => {
    return await db.$transaction(async (tx) => {
      return await tx.user.update({
        where: { id },
        data: {
          roleId: roleId,
        },
        include: {
          role: true,
          UserPermission: {
            include: {
              permission: true,
            },
          },
        },
      })
    })
  }

  createUserPermission = async (data: {
    userId: number
    permissionId: number
  }) => {
    return await db.userPermission.create({ data })
  }

  deleteUserPermission = async (data: {
    userId: number
    permissionId: number
  }) => {
    return await db.userPermission.delete({
      where: {
        userId_permissionId: {
          userId: data.userId,
          permissionId: data.permissionId,
        },
      },
    })
  }

  getRoleById = async (id: number) => {
    return await db.role.findUnique({
      where: { id },
      include: {
        rolePermissions: {
          include: {
            permission: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
  }

  getPermissionById = async (id: number) => {
    return await db.permission.findUnique({ where: { id } })
  }
}
