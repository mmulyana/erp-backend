import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { genSalt, hash } from 'bcryptjs'
import { Prisma } from '@prisma/client'
import db from '../../lib/db'

export interface Payload {
  name: string
  email: string
  password?: string
  rolesId: number
}

interface Query {
  data: {
    name: string
    email: string
    rolesId: number
    password?: string
    created_at?: string
    updated_at?: string
  }
  where: {
    id: number
  }
}

export default class AccountRepository {
  create = async (payload: Payload) => {
    try {
      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            {
              name: payload.name,
            },
            {
              email: payload.email,
            },
          ],
        },
      })
      if (existingUser) {
        throw new Error('user already registered')
      }

      const salt = await genSalt()
      const password = await hash(payload.password || 'password', salt)
      const query = {
        data: {
          ...payload,
          password,
        },
      }
      const user = await db.user.create(query)
      return { user }
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        error.meta?.target === 'users_name_key'
      ) {
        console.error('A user with this name or email already exists')
      } else {
        throw error
      }
    }
  }

  read = async (id: number) => {
    try {
      const data = await db.user.findUnique({
        where: {
          id,
        },
        include: {
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      const rolesIds = data?.roles.map((role) => role.role.id)

      const dataPermissions = await db.rolePermission.findMany({
        where: {
          roleId: {
            in: rolesIds,
          },
        },
        select: {
          permission: {
            select: {
              name: true,
            },
          },
        },
      })

      const permissions = dataPermissions.map(
        (permission) => permission.permission.name
      )

      const user = {
        name: data?.name,
        email: data?.email,
        roles: data?.roles.map((role) => ({
          name: role.role.name,
          id: role.role.id,
        })),
        permissions: [...new Set(permissions)],
      }
      return { user }
    } catch (error) {
      throw error
    }
  }

  readExisting = async (email: string, name: string) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email: email,
          name: name,
        },
      })
      if (user?.email == email && user.name == name) {
        return
      }

      if (user) {
        throw new Error('Akun sudah terdaftar')
      }
    } catch (error) {
      throw error
    }
  }

  update = async (id: number, payload: Payload) => {
    try {
      const updated_at = new Date().toISOString()
      const query: Query = {
        data: {
          name: payload.name,
          email: payload.email,
          rolesId: payload.rolesId,
          updated_at,
        },
        where: {
          id,
        },
      }
      if (!!payload.password) {
        query.data.password = payload.password
      }
      const data = await db.user.update(query)
      let user: any = data
      delete user.password
      return { user }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('A user with this email already exists.')
        }
      }
      throw new Error('Failed to update user')
    }
  }

  delete = async (id: number) => {
    try {
      await db.user.delete({
        where: { id },
      })
    } catch (error) {
      return error
    }
  }

  readAll = async () => {
    try {
      const data = await db.user.findMany({})
      const users = data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        roles: {
          permissions: [],
        },
      }))
      return { users }
    } catch (error) {
      throw error
    }
  }
}
