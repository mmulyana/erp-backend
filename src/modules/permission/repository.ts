import db from '../../lib/db'

type CheckResponse = {
  count_role: number
  count_account: number
  roleNames: string[]
}

interface IPermission {
  check(id: number): Promise<CheckResponse>
  delete(id: number): Promise<void>
}

export default class PermissionRepository implements IPermission {
  delete = async (id: number): Promise<void> => {
    try {
      await db.rolesPermission.deleteMany({
        where: {
          permissionId: id,
        },
      })

      await db.permission.deleteMany({
        where: {
          id,
        },
      })
    } catch (error) {
      throw error
    }
  }
  check = async (id: number): Promise<CheckResponse> => {
    try {
      const rolePermissiondata = await db.rolesPermission.findMany({
        include: {
          roles: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        where: {
          permissionId: id,
        },
      })
      const roles = rolePermissiondata.map((role) => role.roles.name)

      const accounts = await db.user.findMany({
        where: {
          OR: rolePermissiondata.map((role) => ({ rolesId: role.rolesId })),
        },
      })

      return {
        count_account: accounts.length,
        count_role: rolePermissiondata.length,
        roleNames: roles,
      }
    } catch (error) {
      throw error
    }
  }
}
