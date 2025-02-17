import { HttpStatusCode } from 'axios'
import { hash } from 'bcryptjs'

import { create, findByEmail, findByPhone, findByUsername } from './repository'
import type { CreateAccount } from './schema'

import { throwError } from '../../utils/error-handler'
import { Messages } from '../../utils/constant'

export const createUserService = async (payload: CreateAccount) => {
  if (!!payload.email) {
    const data = await findByEmail(payload.email)
    if (data) {
      return throwError(Messages.EmaildAlreadyUsed, HttpStatusCode.BadRequest)
    }
  }

  if (!!payload.phone) {
    const data = await findByPhone(payload.phone)
    if (data) {
      return throwError(Messages.PhoneAlreadyUsed, HttpStatusCode.BadRequest)
    }
  }

  const exists = await findByUsername(payload.username)
  if (exists) {
    return throwError(Messages.UsernameAlreadyUsed, HttpStatusCode.BadRequest)
  }

  const password = await hash(process.env.DEFAULT_PASSWORD as string, 10)
  const data = await create({
    ...payload,
    password
  })
  return data
}
// import { deleteFile } from '../../utils/file'
// import {
//   CreateAccountSchema,
//   UpdateAccountSchema,
//   UpdatePasswordDto,
// } from './schema'
// import AccountRepository from './repository'
// import { compare, hash } from 'bcryptjs'
// import { Prisma } from '@prisma/client'

// export interface FilterUser {
//   name?: string
//   email?: string
//   phoneNumber?: string
//   roleId?: number
// }
// export default class AccountService {
//   private repository: AccountRepository = new AccountRepository()

//   getAccount = async (id: number) => {
//     const data = await this.repository.getAccountById(id)
//     if (!data) {
//       throw new Error('akun tidak ditemukan')
//     }

//     const rolePermissions =
//       data.role?.RolePermission?.map((rp) => rp.permission.key) || []
//     const permissions = [...new Set([...rolePermissions])]

//     const dataTour = await this.repository.findAllToursByUserId(data.id)

//     return {
//       id: data.id,
//       email: data.email,
//       name: data.name,
//       phoneNumber: data.phoneNumber,
//       photo: data.photo,
//       roleId: data.roleId,
//       employeeId: data.employeeId,
//       created_at: data.created_at,
//       employee: data.employee,
//       role: {
//         id: data.role?.id,
//         name: data.role?.name,
//         description: data.role?.description,
//       },
//       permissions,
//       tours: dataTour.map((item) => item.name),
//     }
//   }
//   getAllAccount = async (
//     page?: number,
//     limit?: number,
//     filter?: FilterUser
//   ) => {
//     const result = await this.repository.findByPagination(page, limit, filter)
//     const data = result.data.map((item) => {
//       return {
//         id: item.id,
//         email: item.email,
//         name: item.name,
//         phoneNumber: item.phoneNumber,
//         photo: item.photo,
//         roleId: item.roleId,
//         created_at: item.created_at,
//         active: item.active,
//         role: {
//           id: item.role?.id,
//           name: item.role?.name,
//           description: item.role?.description,
//         },
//       }
//     })

//     return { ...result, data }
//   }
//   updateAccount = async (
//     id: number,
//     payload: Omit<UpdateAccountSchema, 'photo'> & { newPhoto?: string }
//   ) => {
//     const data = await this.repository.getAccountById(id)

//     if (!!payload.email && payload.email !== data?.email) {
//       const data = await this.repository.findByEmail(payload?.email)
//       if (data.exist) {
//         throw new Error('Email ini sudah digunakan')
//       }
//     }
//     if (!!payload.phoneNumber && payload.phoneNumber !== data?.phoneNumber) {
//       const data = await this.repository.findByPhone(payload?.phoneNumber)
//       if (data.exist) {
//         throw new Error('Nomor telp ini sudah digunakan')
//       }
//     }
//     if (!!payload.name && payload.name !== data?.name) {
//       const data = await this.repository.findByName(payload?.name)
//       if (data.exist) {
//         throw new Error('Nama ini sudah digunakan, silahkan pakai nama lain')
//       }
//     }

//     let newData: Prisma.UserUpdateInput = {}

//     if ('newPhoto' in payload) {
//       const currentUser = await this.repository.getAccountById(id)
//       if (currentUser?.photo) {
//         deleteFile(currentUser.photo)
//       }

//       newData.photo = payload.newPhoto || null

//       const { newPhoto, ...restPayload } = payload
//       newData = { ...restPayload, ...newData }
//     } else {
//       newData = payload
//     }

//     return await this.repository.updateAccountById(id, newData)
//   }
//   deleteAccount = async (id: number) => {
//     const isAccountExist = await this.repository.getAccountById(id)
//     if (!isAccountExist) {
//       throw Error('Akun tidak ada')
//     }
//     await this.repository.deleteAccountById(id)
//   }
//   createAccount = async (payload: CreateAccountSchema) => {
//     if (!!payload.email) {
//       const data = await this.repository.findByEmail(payload.email)
//       if (data.exist) {
//         throw new Error('Email ini sudah digunakan')
//       }
//     }
//     if (!!payload.phoneNumber) {
//       const data = await this.repository.findByPhone(payload?.phoneNumber)
//       if (data.exist) {
//         throw new Error('Nomor telp ini sudah digunakan')
//       }
//     }
//     if (!!payload.name) {
//       const data = await this.repository.findByName(payload?.name)
//       if (data.exist) {
//         throw new Error('Nama ini sudah digunakan, silahkan pakai nama lain')
//       }
//     }

//     const hashedPassword = await hash('password', 10)

//     const account = await this.repository.createAccount({
//       ...payload,
//       password: hashedPassword,
//     })

//     return account
//   }
//   updateRoleAccount = async (id: number, roleId: number) => {
//     const account = await this.repository.getAccountById(id)
//     if (!account) {
//       throw new Error('Akun tidak ada')
//     }

//     const role = await this.repository.getRoleById(roleId)
//     if (!role) {
//       throw new Error('Role tidak ada')
//     }

//     await this.repository.updateAccountById(id, {
//       role: {
//         connect: {
//           id: roleId,
//         },
//       },
//     })
//   }
//   updatePassword = async (userId: number, data: UpdatePasswordDto) => {
//     const user = await this.repository.getAccountById(userId)
//     if (!user) {
//       throw new Error('User tidak ditemukan')
//     }

//     const isValidPassword = await compare(data.oldPassword, user.password)
//     if (!isValidPassword) {
//       throw new Error('Password lama tidak sama')
//     }

//     if (data.oldPassword === data.newPassword) {
//       throw new Error('Password baru tidak boleh sama')
//     }

//     const hashedPassword = await hash(data.newPassword, 10)

//     await this.repository.updateAccountById(userId, {
//       password: hashedPassword,
//     })
//   }
//   resetPassword = async (userId: number, newPassword: string) => {
//     const user = await this.repository.getAccountById(userId)
//     if (!user) {
//       throw new Error('User tidak ditemukan')
//     }

//     const hashedPassword = await hash(newPassword, 10)

//     await this.repository.updateAccountById(userId, {
//       password: hashedPassword,
//     })
//   }
//   activate = async (id: number) => {
//     await this.repository.updateAccountById(id, { active: true })
//   }
//   deactivate = async (id: number) => {
//     await this.repository.updateAccountById(id, { active: false })
//   }
//   createTourAccount = async (id: number, name: string) => {
//     const isExist = await this.repository.findTourByUserIdAndName(id, name)
//     if (isExist) {
//       throw new Error('Tour sudah ada')
//     }

//     await this.repository.createTour(id, name)
//   }
// }
