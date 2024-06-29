import db from '../../lib/db'
import { MESSAGE } from '../../utils/constant/error'

export default class PermissionGroupRepository {
  readAll = async () => {
    try {
      const data = await db.permissionGroup.findMany({
        select: {
          id: true,
          name: true,
          permission: {
            select: {
              name: true,
            },
          },
        },
      })

      return { groups: data }
    } catch (error) {
      throw error
    }
  }

  read = async (id: number) => {
    try {
      const data = await db.permissionGroup.findMany({
        select: {
          id: true,
          name: true,
          permission: {
            select: {
              name: true,
            },
          },
        },
        where: {
          id,
        },
      })

      return { group: data }
    } catch (error) {
      throw error
    }
  }

  create = async (name: string, permissionNames: string[]) => {
    try {
      await this.findExisting(name)

      const group = await db.permissionGroup.create({
        data: {
          name,
        },
      })

      if (permissionNames && permissionNames.length > 0) {
        await db.permission.createMany({
          data: permissionNames.map((permission) => ({
            name: permission,
            groupId: group.id,
          })),
        })
      }
    } catch (error) {
      throw error
    }
  }

  update = async (name: string, id: number) => {
    try {
      await db.permissionGroup.update({
        data: {
          name,
        },
        where: {
          id,
        },
      })
    } catch (error) {
      throw error
    }
  }

  findExisting = async (name: string) => {
    try {
      const data = await db.permissionGroup.findFirst({
        where: {
          name,
        },
      })

      if (data) {
        throw new Error(MESSAGE.GROUP_NAME_ALREADY_USED)
      }

      return true
    } catch (error) {
      throw error
    }
  }

  delete = async (id: number) => {
    try {
      const permissions = await db.permission.findMany({
        where: {
          groupId: id,
        },
      })

      if (permissions.length > 0) {
        throw new Error(MESSAGE.CANT_DELETE_GROUP)
      }

      await db.permissionGroup.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      throw error
    }
  }
}
