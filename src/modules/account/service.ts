import { deleteFile } from '../../utils/file'
import AccountRepository from './repository'
import { compare, hash } from 'bcryptjs'
import { Prisma } from '@prisma/client'
import { UpdatePasswordDto } from './schema'

export type CreateAccountDto = {
  email: string
  name: string
  password: string
  phoneNumber: string
  employeeId?: number
  roleId?: number
  photo?: string
}

interface Account {
  id: number
  email: string
  name: string
  phoneNumber: string
  photo?: string | null
  roleId?: number | null
  employeeId?: number | null
  employee?: any
  role?: any
  permissions: string[]
}

export default class AccountService {
  private repository: AccountRepository = new AccountRepository()

  getAccount = async (id: number): Promise<Account> => {
    const data = await this.repository.getAccountById(id)
    if (!data) {
      throw new Error('akun tidak ditemukan')
    }

    const userPermissions = data.UserPermission.map((up) => up.permission.name)

    const rolePermissions =
      data.role?.rolePermissions?.map((rp) => rp.permission.name) || []

    const permissions = [...new Set([...userPermissions, ...rolePermissions])]

    return {
      id: data.id,
      email: data.email,
      name: data.name,
      phoneNumber: data.phoneNumber,
      photo: data.photo,
      roleId: data.roleId,
      employeeId: data.employeeId,
      employee: data.employee,
      role: data.role,
      permissions,
    }
  }
  updateAccount = async (
    id: number,
    payload: Prisma.UserUpdateInput & { newPhoto?: string }
  ) => {
    let newData: Prisma.UserUpdateInput = {}

    if (payload.newPhoto || payload.photo === null) {
      const data = await this.repository.getAccountById(id)
      if (data?.photo) {
        deleteFile(data.photo)
      }
      newData.photo = null
    }
    if (payload.newPhoto) {
      newData.photo = payload.newPhoto
    }

    newData = { ...payload, ...newData }

    await this.repository.updateAccountById(id, newData)
  }
  deleteAccount = async (id: number) => {
    const isAccountExist = await this.repository.getAccountById(id)
    if (!isAccountExist) {
      throw Error('Akun tidak ada')
    }
    await this.repository.deleteAccountById(id)
  }
  createAccount = async (data: CreateAccountDto) => {
    if (!data.email || !data.name || !data.phoneNumber) {
      throw new Error('Missing required fields')
    }

    const hashedPassword = await hash(data.password || 'password', 10)

    const account = await this.repository.createAccount({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      phoneNumber: data.phoneNumber,
      employeeId: data.employeeId,
      photo: data.photo,
      roleId: data.roleId,
    })

    return account
  }
  updateRoleAccount = async (id: number, roleId: number) => {
    const account = await this.repository.getAccountById(id)
    if (!account) {
      throw new Error('Akun tidak ada')
    }

    const role = await this.repository.getRoleById(roleId)
    if (!role) {
      throw new Error('Role tidak ada')
    }

    await this.repository.updateRoleAccount(id, roleId)
  }
  createPermissionAccount = async (userId: number, permissionId: number) => {
    const account = await this.repository.getAccountById(userId)
    if (!account) {
      throw new Error('Akun tidak ada')
    }

    const permission = await this.repository.getPermissionById(permissionId)
    if (!permission) {
      throw new Error('Hak istimewa tidak ada')
    }

    await this.repository.createUserPermission({ userId, permissionId })
  }
  deletePermissionAccount = async (userId: number, permissionId: number) => {
    const account = await this.repository.getAccountById(userId)
    if (!account) {
      throw new Error('Akun tidak ada')
    }

    const permission = await this.repository.getPermissionById(permissionId)
    if (!permission) {
      throw new Error('Hak istimewa tidak ada')
    }

    await this.repository.deleteUserPermission({ userId, permissionId })
  }
  updatePassword = async (userId: number, data: UpdatePasswordDto) => {
    const user = await this.repository.getAccountById(userId)
    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    const isValidPassword = await compare(data.oldPassword, user.password)
    if (!isValidPassword) {
      throw new Error('Password lama tidak sama')
    }

    if (data.oldPassword === data.newPassword) {
      throw new Error('Password baru tidak boleh sama')
    }

    const hashedPassword = await hash(data.newPassword, 10)

    await this.repository.updateAccountById(userId, {
      password: hashedPassword,
    })
  }
  resetPassword = async (userId: number, newPassword: string) => {
    const user = await this.repository.getAccountById(userId)
    if (!user) {
      throw new Error('User tidak ditemukan')
    }

    const hashedPassword = await hash(newPassword, 10)

    await this.repository.updateAccountById(userId, {
      password: hashedPassword,
    })
  }
}
