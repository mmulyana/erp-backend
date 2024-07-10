import prisma from '../../../lib/prisma'
import db from '../../lib/db'
import extractPermission from '../../utils/extract-permission'

type Payload = {
  name: string
  permissionIds: number[]
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
      const data = await prisma.roles.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          id: true,
          permissions: {
            select: {
              id: true,
              enabled: true,
              permission: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      const role = {
        ...data,
        permissions: data?.permissions
          ? extractPermission(data?.permissions)
          : [],
        permissionIds: data?.permissions.map((d) => d.permission.id),
      }
      return { role }
    } catch (error) {
      throw error
    }
  }

  update = async (id: number, payload: Payload) => {
    const permissionIds = await db.rolesPermission.findMany({
      where: {
        rolesId: id,
      },
      select: {
        permission: {
          select: {
            id: true,
          },
        },
      },
    })

    const existingPermission = permissionIds.map(
      (permission) => permission.permission.id
    )
    console.log('existing', existingPermission)
    console.log('new permission', payload.permissionIds)
  }

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
