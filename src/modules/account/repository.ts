import { FilterUser } from './service'
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
            RolePermission: {
              include: {
                permission: true,
              },
            },
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

  createAccount = async (data: Prisma.UserCreateManyInput) => {
    return await db.user.create({
      data,
    })
  }

  getRoleById = async (id: number) => {
    return await db.role.findUnique({
      where: { id },
    })
  }

  getPermissionById = async (id: number) => {
    return await db.permission.findUnique({ where: { id } })
  }

  findByPhone = async (phoneNumber: string) => {
    const data = await db.user.findUnique({ where: { phoneNumber } })
    if (data) {
      return { exist: true }
    }
    return { exist: false }
  }
  findByName = async (name: string) => {
    const data = await db.user.findUnique({ where: { name } })
    if (data) {
      return { exist: true }
    }
    return { exist: false }
  }
  findByEmail = async (email: string) => {
    const data = await db.user.findUnique({ where: { email } })
    if (data) {
      return { exist: true }
    }
    return { exist: false }
  }

  findAllToursByUserId = async (userId: number) => {
    return await db.tour.findMany({ where: { userId } })
  }

  findTourByUserIdAndName = async (userId: number, name: string) => {
    return await db.tour.findFirst({
      where: {
        userId,
        name,
      },
    })
  }
  createTour = async (userId: number, name: string) => {
    return await db.tour.create({
      data: {
        userId,
        name,
      },
    })
  }
}
