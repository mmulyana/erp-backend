import { CreateAccountDto, FilterUser } from './service'
import { Prisma } from '@prisma/client'
import db from '../../lib/db'

export default class AccountRepository {
  findByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterUser
  ) => {
    const skip = (page - 1) * limit
    let where: Prisma.UserWhereInput = {}

    if (filter) {
      if (filter.name) {
        where = {
          ...where,
          OR: [
            { name: { contains: filter.name.toLowerCase() } },
            { name: { contains: filter.name.toUpperCase() } },
            { name: { contains: filter.name } },
          ],
        }
      }

      if (filter.email) {
        where = {
          ...where,
          OR: [
            { email: { contains: filter.email.toLowerCase() } },
            { email: { contains: filter.email.toUpperCase() } },
            { email: { contains: filter.email } },
          ],
        }
      }

      if (filter.phoneNumber) {
        where = {
          ...where,
          phoneNumber: {
            contains: filter.phoneNumber,
          },
        }
      }

      if (filter.roleId) {
        where = {
          ...where,
          roleId: filter.roleId,
        }
      }
    }

    const data = await db.user.findMany({
      skip,
      take: limit,
      where,
      include: {
        role: true,
      },
    })

    const total = await db.user.count({ where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }
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

  findByPhone = async (phoneNumber: string) => {
    const data = await db.user.findUnique({ where: { phoneNumber } })
    if (data) {
      return { result: false }
    }
    return { result: true }
  }
  findByName = async (name: string) => {
    const data = await db.user.findUnique({ where: { name } })
    if (data) {
      return { result: false }
    }
    return { result: true }
  }
  findByEmail = async (email: string) => {
    const data = await db.user.findUnique({ where: { email } })
    if (data) {
      return { result: false }
    }
    return { result: true }
  }
}
