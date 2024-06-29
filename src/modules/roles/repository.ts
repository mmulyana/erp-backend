import prisma from '../../../lib/prisma'
import db from '../../lib/db'
import extractPermission from '../../utils/extract-permission'

type Payload = {
  name: string
}

export default class RolesRepository {
  create = async (name: string, permissionIds?: number[]) => {
    try {
      const existing = await prisma.roles.findFirst({
        where: {
          name,
        },
      })
      if (existing) {
        throw new Error('Pilih name role baru')
      }

      const role = await prisma.roles.create({
        data: {
          name,
        },
      })

      if (permissionIds && permissionIds?.length > 0) {
        await db.rolesPermission.createMany({
          data: permissionIds.map((id) => ({
            enabled: true,
            rolesId: role.id,
            permissionId: id,
          })),
        })
      }
    } catch (error) {
      throw error
    }
  }

  read = async (id: number) => {
    try {
      const data = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          role: {
            select: {
              id: true,
              name: true,
              permissions: {
                select: {
                  enabled: true,
                  permission: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      const role = {
        ...data?.role,
        permissions: extractPermission(data?.role?.permissions || []),
      }
      return { role }
    } catch (error) {
      throw error
    }
  }

  update = async (id: number, payload: Payload) => {}

  delete = async (id: number) => {}

  readAll = async () => {
    try {
      const data = await prisma.roles.findMany({
        orderBy: {
          name: 'asc',
        },
        select: {
          name: true,
          id: true,
          permissions: {
            select: {
              enabled: true,
              permission: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })

      const roles = data.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: extractPermission(role.permissions),
      }))

      return { roles }
    } catch (error) {
      throw error
    }
  }
}
