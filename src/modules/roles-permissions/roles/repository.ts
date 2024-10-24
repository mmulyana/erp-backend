import db from '../../../lib/db'

type Payload = {
  name: string
  permissionIds: number[]
}

export default class RolesRepository {
  create = async (name: string, permissionIds?: number[]) => {
    try {
      const existing = await db.role.findFirst({
        where: {
          name,
        },
      })
      if (existing) {
        throw new Error('Pilih name role baru')
      }

      const role = await db.role.create({
        data: {
          name,
        },
      })

      if (permissionIds && permissionIds?.length > 0) {
        await db.rolePermission.createMany({
          data: permissionIds.map((id) => ({
            roleId: role.id,
            permissionId: id,
          })),
        })
      }
    } catch (error) {
      throw error
    }
  }

  read = async (id: number) => {
    const existingRole = await db.role.findUnique({ where: { id } })

    if (!existingRole) {
      throw Error('Role tidak ditemukan')
    }

    try {
      const data = await db.role.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          id: true,
          permissions: {
            select: {
              id: true,
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
        permissions: data?.permissions.map((item) => ({
          name: item.permission.name,
          id: item.permission.id,
        })),
        permissionIds: data?.permissions.map((d) => d.permission.id),
      }
      return { role }
    } catch (error) {
      throw error
    }
  }

  update = async (id: number, payload: Payload) => {
    try {
      const existingRole = await db.role.findUnique({ where: { id } })

      if (!existingRole) {
        throw new Error('Role tidak ditemukan')
      }

      if (payload.name !== '') {
        await db.role.update({
          where: { id },
          data: { name: payload.name },
        })
      }

      if (payload.permissionIds && payload.permissionIds.length > 0) {
        const result = await db.$transaction(async (prisma) => {
          await prisma.rolePermission.deleteMany({
            where: { roleId: id },
          })

          const updateRole = await prisma.rolePermission.createMany({
            data: payload.permissionIds.map((permissionId) => ({
              permissionId,
              roleId: id,
            })),
          })

          return updateRole
        })

        return result
      }
    } catch (error) {
      throw error
    }
  }

  delete = async (id: number) => {
    const existingRole = await db.role.findUnique({ where: { id } })

    if (!existingRole) {
      throw Error('Role tidak ditemukan')
    }

    await db.rolePermission.deleteMany({
      where: {
        roleId: id,
      },
    })

    await db.role.delete({
      where: {
        id,
      },
    })
  }

  readAll = async () => {
    try {
      const data = await db.role.findMany({
        orderBy: {
          name: 'asc',
        },
        select: {
          name: true,
          id: true,
          permissions: {
            select: {
              permission: {
                select: {
                  name: true,
                  id: true,
                },
              },
            },
          },
        },
      })

      const roles = data.map((role) => ({
        id: role.id,
        name: role.name,
        permissions: role.permissions.map((item) => ({
          name: item.permission.name,
          id: item.permission.id,
        })),
      }))

      return { roles }
    } catch (error) {
      throw error
    }
  }
}
