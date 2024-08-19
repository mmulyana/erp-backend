import db from '../../../lib/db'

type CheckResponse = {
  count_role: number
  roleNames: string[]
}

interface IPermission {
  check(id: number): Promise<CheckResponse>
  delete(id: number): Promise<void>
}

export default class PermissionRepository implements IPermission {
  delete = async (id: number): Promise<void> => {
    try {
      await db.rolePermission.deleteMany({
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
      const rolePermissiondata = await db.rolePermission.findMany({
        include: {
          role: {
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
      const roles = rolePermissiondata.map((role) => role.role.name)

      return {
        count_role: rolePermissiondata.length,
        roleNames: roles,
      }
    } catch (error) {
      throw error
    }
  }
}
