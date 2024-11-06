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
    return data
  }
  getRoles = async () => {
    return this.repository.getAll()
  }
  updateRole = async (id: number, data: updateRoleDTO) => {
    await this.getRoleBydId(id)

    await this.repository.updateById(id, data)
  }
  deleteRole = async (id: number) => {
    await this.getRoleBydId(id)

    await this.repository.deleteById(id)
  }
  addPermissionRole = async (roleId: number, permissionId: number) => {
    const data = await this.getRoleBydId(roleId)

    const permission = await this.repository.getPermissionById(permissionId)
    if (!permission) {
      throw new Error('Hak istimewa tidak ditemukan')
    }

    await this.repository.createPermissionRole({ roleId, permissionId })
    return { id: data.id }
  }
  removePermissionRole = async (roleId: number, permissionId: number) => {
    const data = await this.getRoleBydId(roleId)

    const permission = await this.repository.getPermissionById(permissionId)
    if (!permission) {
      throw new Error('Hak istimewa tidak ditemukan')
    }

    await this.repository.deletePermissionRole({ roleId, permissionId })
    return { id: data.id }
  }
}
