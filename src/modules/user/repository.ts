import { CreateAccount, UpdateAccount } from './schema'
import { getPaginateParams } from '../../utils/params'
import db from '../../lib/prisma'

export const create = async (data: CreateAccount & { password: string }) => {
  return await db.user.create({ data })
}

export const update = async (id: string, data: UpdateAccount) => {
  return await db.user.update({ data, where: { id } })
}

export const findAll = async (
  page?: number,
  limit?: number,
  search?: string,
  active?: boolean,
  roleId?: string,
) => {
  const where = {
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
    ],
  }

  if (page && limit) {
    const { skip, take } = getPaginateParams(page, limit)

    const [users, total] = await Promise.all([
      db.user.findMany({
        skip,
        take,
        where,
        include: {
          role: true,
        },
      }),
      db.user.count({ where }),
    ])

    return {
      data: users,
      total,
      page,
      limit,
    }
  }

  const users = await db.user.findMany({
    where,
    include: {
      role: true,
    },
  })

  return {
    data: users,
    total: users.length,
    page: 1,
    limit: users.length,
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
