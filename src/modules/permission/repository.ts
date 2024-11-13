import {
  AddPermissionsToGroupDTO,
  CreatePermissionDTO,
  CreatePermissionGroupDTO,
  UpdatePermissionDTO,
  UpdatePermissionGroupDTO,
} from './schema'
import db from '../../lib/db'

export class PermissionRepository {
  async create(data: CreatePermissionDTO) {
    return db.permission.create({
      data,
      include: {
        group: true,
      },
    })
  }

  async findAll(params?: { where?: { name?: string; groupId?: number } }) {
    return db.permission.findMany({
      where: params?.where,
      include: {
        group: true,
      },
    })
  }

  async findById(id: number) {
    return db.permission.findUnique({
      where: { id },
      include: {
        group: true,
      },
    })
  }

  async findByKey(key: string) {
    return db.permission.findUnique({
      where: { key },
      include: {
        group: true,
      },
    })
  }

  async update(id: number, data: UpdatePermissionDTO) {
    return db.permission.update({
      where: { id },
      data,
      include: {
        group: true,
      },
    })
  }

  async delete(id: number) {
    return db.permission.delete({
      where: { id },
    })
  }

  async createGroup(data: CreatePermissionGroupDTO) {
    return db.permissionGroup.create({
      data,
      include: {
        permissions: true,
      },
    })
  }

  async findAllGroup(params?: { where?: { name?: string } }) {
    return db.permissionGroup.findMany({
      where: params?.where,
      include: {
        permissions: true,
      },
    })
  }

  async findByIdGroup(id: number) {
    return db.permissionGroup.findUnique({
      where: { id },
      include: {
        permissions: true,
      },
    })
  }

  async updateGroup(id: number, data: UpdatePermissionGroupDTO) {
    return db.permissionGroup.update({
      where: { id },
      data,
      include: {
        permissions: true,
      },
    })
  }

  async deleteGroup(id: number) {
    return db.permissionGroup.delete({
      where: { id },
    })
  }

  async addPermissionsGroup(
    id: number,
    { permissionIds }: AddPermissionsToGroupDTO
  ) {
    return db.permissionGroup.update({
      where: { id },
      data: {
        permissions: {
          connect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    })
  }

  async removePermissionsGroup(
    id: number,
    { permissionIds }: AddPermissionsToGroupDTO
  ) {
    return db.permissionGroup.update({
      where: { id },
      data: {
        permissions: {
          disconnect: permissionIds.map((id) => ({ id })),
        },
      },
      include: {
        permissions: true,
      },
    })
  }
}
