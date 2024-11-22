import RoleRepository from './repository'
import { createRoleDTO, updateRoleDTO } from './schema'

export default class RoleService {
  private repository: RoleRepository = new RoleRepository()

  createRole = async (data: createRoleDTO) => {
    return await this.repository.create(data)
  }
  getRoleBydId = async (id: number) => {
    const data = await this.repository.getById(id)
    if (!data) {
      throw new Error('Role tidak ditemukan')
    }
    return {
      ...data,
      permissions: data.RolePermission.map((item) => item.permission.key),
    }
  }
  getRoles = async () => {
    const data = await this.repository.getAll()
    return data.filter((item) => item.id !== 1)
  }
  updateRole = async (id: number, data: updateRoleDTO) => {
    await this.getRoleBydId(id)

    await this.repository.updateById(id, data)
  }
  deleteRole = async (id: number) => {
    const data = await this.getRoleBydId(id)
    if (!data) {
      throw new Error('Peran tidak ada')
    }
    if (data.name === 'Superadmin') {
      throw new Error('Peran ini tidak boleh dihapus')
    }

    await this.repository.deleteById(id)
  }
  addPermissionRole = async (roleId: number, permissionId: number) => {
    const data = await this.getRoleBydId(roleId)
    if (!data) {
      throw new Error('Peran tidak ditemukan')
    }

    const permission = await this.repository.getPermissionById(permissionId)
    if (!permission) {
      throw new Error('Hak istimewa tidak ditemukan')
    }

    await this.repository.createPermissionRole({ roleId, permissionId })
    return { roleId }
  }
  removePermissionRole = async (roleId: number, permissionId: number) => {
    const data = await this.repository.deletePermissionRole(
      roleId,
      permissionId
    )
    return { roleId: data.roleId }
  }
}
