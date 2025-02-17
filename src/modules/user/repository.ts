import { CreateAccount, UpdateAccount } from './schema'
import { getPaginateParams } from '../../utils/params'
import db from '../../lib/prisma'
import { isValidUUID } from '../../utils/is-valid-uuid'
import { throwError } from '../../utils/error-handler'
import { Messages } from '../../utils/constant'
import { HttpStatusCode } from 'axios'

export const create = async (data: CreateAccount & { password: string }) => {
  return await db.user.create({ data })
}

export const update = async (
  id: string,
  data: UpdateAccount & {
    deletedAt?: string
    active?: boolean
    photoUrl?: string
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
      { deletedAt: null },
    ],
  }

  if (page === undefined || limit === undefined) {
    const users = await db.user.findMany({
      where,
      orderBy: { username: 'asc' },
      include: {
        role: true,
      },
    })

    return { users }
  }

  const { skip, take } = getPaginateParams(page, limit)

  const [users, total] = await Promise.all([
    db.user.findMany({
      skip,
      take,
      where,
      orderBy: { username: 'asc' },
      include: {
        role: true,
      },
    }),
    db.user.count({ where }),
  ])

  return {
    users,
    total,
    page,
    limit,
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
  return db.user.findUnique({ where: { id } })
}

export const findRoleById = async (id: string) => {
  if (!isValidUUID(id)) {
    return throwError(Messages.InvalidUUID, HttpStatusCode.NotFound)
  }
  return db.role.findUnique({ where: { id } })
}
