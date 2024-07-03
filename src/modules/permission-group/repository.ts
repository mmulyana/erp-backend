import db from '../../lib/db'
import { MESSAGE } from '../../utils/constant/error'

type createPayload = {
  name: string
  permissionNames: string[]
  description?: string
}

export default class PermissionGroupRepository {
  readAll = async () => {
    try {
      const data = await db.permissionGroup.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          permissions: {
            select: {
              id: true,
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
          description: true,
          permissions: {
            select: {
              id: true,
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

  create = async (payload: createPayload) => {
    try {
      await this.findExisting(payload.name)

      const group = await db.permissionGroup.create({
        data: {
          name: payload.name,
          description: payload.description,
        },
      })

      await this.updatePermissions(payload.permissionNames, group.id)
    } catch (error) {
      throw error
    }
  }

  update = async (payload: createPayload, id: number) => {
    try {
      await db.permissionGroup.update({
        data: {
          name: payload.name,
          description: payload.description,
        },
        where: {
          id,
        },
      })

      await this.updatePermissions(payload.permissionNames, id)
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

  updatePermissions = async (permissionNames: string[], id: number) => {
    try {
      if (!permissionNames || !id) {
        throw new Error('permissions required or id required')
      }

      await db.permission.createMany({
        data: permissionNames.map((permission) => ({
          name: permission,
          groupId: id,
        })),
      })
    } catch (error) {
      throw error
    }
  }
}
