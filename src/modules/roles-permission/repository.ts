import { RolesPermission } from '@prisma/client'
import db from '../../lib/db'

type Payload = {
  rolesId: number
  permissionId: number[]
  enabled: boolean
}

interface IRolePermission {
  create(payload: Payload): Promise<void>
  update(payload: Payload, id: number): Promise<void>
  delete(id: number): Promise<void>
  read(id: number): Promise<RolesPermission | null>
  readAll(): Promise<RolesPermission[]>
}

export default class RolePermissionRepository implements IRolePermission {
  create = async (payload: Payload) => {
    try {
      await db.rolesPermission.createMany({
        data: payload.permissionId.map((permission) => ({
          permissionId: permission,
          rolesId: payload.rolesId,
          enabled: true,
        })),
      })
    } catch (error) {
      throw error
    }
  }

  update = async (payload: Payload, id: number) => {
    try {
      await db.rolesPermission.deleteMany({
        where: {
          rolesId: payload.rolesId
        }
      })

      await db.rolesPermission.createMany({
        data: payload.permissionId.map((permission) => ({
          permissionId: permission,
          rolesId: payload.rolesId,
          enabled: true,
        })),
      })
    } catch (error) {
      throw error
    }
  }

  read = async (id: number): Promise<RolesPermission | null> => {
    try {
      const data = await db.rolesPermission.findUnique({
        where: {
          id: Number(id),
        },
      })

      if (!data) {
        throw new Error('role permission not found')
      }

      return data
    } catch (error) {
      throw error
    }
  }

  readAll = async (): Promise<RolesPermission[]> => {
    try {
      const data = await db.rolesPermission.findMany()
      return data || []
    } catch (error) {
      throw error
    }
  }

  delete = async (id: number): Promise<void> => {
    try {
      const data = await db.rolesPermission.findUnique({
        where: {
          id: Number(id),
        },
      })

      if (!data) {
        throw new Error('role permission not found')
      }

      await db.rolesPermission.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      throw error
    }
  }
}
