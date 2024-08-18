import { RolePermission } from '@prisma/client'
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
  read(id: number): Promise<RolePermission | null>
  readAll(): Promise<RolePermission[]>
}

export default class RolePermissionRepository implements IRolePermission {
  create = async (payload: Payload) => {
    try {
      await db.rolePermission.createMany({
        data: payload.permissionId.map((permission) => ({
          permissionId: permission,
          roleId: payload.rolesId,
        })),
      })
    } catch (error) {
      throw error
    }
  }

  update = async (payload: Payload, id: number) => {
    try {
      await db.rolePermission.deleteMany({
        where: {
          roleId: payload.rolesId
        }
      })

      await db.rolePermission.createMany({
        data: payload.permissionId.map((permission) => ({
          permissionId: permission,
          roleId: payload.rolesId,
        })),
      })
    } catch (error) {
      throw error
    }
  }

  read = async (id: number): Promise<RolePermission | null> => {
    try {
      const data = await db.rolePermission.findUnique({
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

  readAll = async (): Promise<RolePermission[]> => {
    try {
      const data = await db.rolePermission.findMany()
      return data || []
    } catch (error) {
      throw error
    }
  }

  delete = async (id: number): Promise<void> => {
    try {
      const data = await db.rolePermission.findUnique({
        where: {
          id: Number(id),
        },
      })

      if (!data) {
        throw new Error('role permission not found')
      }

      await db.rolePermission.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      throw error
    }
  }
}
