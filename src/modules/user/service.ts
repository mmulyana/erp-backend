import { HttpStatusCode } from 'axios'
import { hash } from 'bcryptjs'

import {
  create,
  findByEmail,
  findById,
  findByPhone,
  findByUsername,
  findRoleById,
  update,
} from './repository'
import type { CreateAccount, UpdateAccount } from './schema'

import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { deleteFile } from '@/utils/file'
import { isValidUUID } from '@/utils/is-valid-uuid'

const isExist = async (payload: CreateAccount | UpdateAccount) => {
  if (!!payload.email) {
    const user = await findByEmail(payload.email)
    if (user) {
      return throwError(Messages.EmaildAlreadyUsed, HttpStatusCode.BadRequest)
    }
  }

  if (!!payload.phone) {
    const user = await findByPhone(payload.phone)
    if (user) {
      return throwError(Messages.PhoneAlreadyUsed, HttpStatusCode.BadRequest)
    }
  }
  if (!!payload.username) {
    const user = await findByUsername(payload.username)
    if (user) {
      return throwError(Messages.UsernameAlreadyUsed, HttpStatusCode.BadRequest)
    }
  }
}

const isExistById = async (id: string) => {
  const data = await findById(id)
  if (!data) {
    return throwError(Messages.dataNotFound, HttpStatusCode.BadRequest)
  }
}

export const createUserService = async (payload: CreateAccount) => {
  await isExist(payload)

  const password = await hash(process.env.DEFAULT_PASSWORD as string, 10)

  const data = await create({
    ...payload,
    password,
  })
  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
  }
}

export const updateUserService = async (id: string, payload: UpdateAccount) => {
  await isExist(payload)
  await isExistById(id)

  const data = await update(id, payload)
  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
  }
}

export const deleteUserService = async (id: string) => {
  await isExistById(id)

  await update(id, {
    deletedAt: new Date().toISOString(),
    active: false,
  })
}

export const unactivateUserService = async (id: string) => {
  await isExistById(id)

  await update(id, {
    active: false,
  })
}

export const activateUserService = async (id: string) => {
  await isExistById(id)

  await update(id, {
    active: true,
  })
}

export const addRoleUserService = async (id: string, roleId: string) => {
  await isExistById(id)
  const role = await findRoleById(roleId)
  if (!role) {
    return throwError(
      `Role ini ${Messages.notFound}`,
      HttpStatusCode.BadRequest,
    )
  }

  const data = await update(id, {
    roleId,
  })

  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
  }
}

export const removeRoleUserService = async (id: string) => {
  const data = await update(id, {
    roleId: null,
  })

  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
  }
}

export const addPhotoUserService = async (id: string, photoUrl: string) => {
  await isExistById(id)
  const exist = await findById(id)
  if (exist && exist.photoUrl) {
    await deleteFile(exist.photoUrl)
  }

  const data = await update(id, {
    photoUrl,
  })

  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
  }
}

export const removePhotoUserService = async (id: string) => {
  await isExistById(id)

  const user = await findById(id)
  if (user && user.photoUrl) {
    await deleteFile(user?.photoUrl)
  }

  const data = await update(id, {
    photoUrl: undefined,
  })

  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: undefined,
  }
}

export const findUserService = async (id: string) => {
  if (!isValidUUID(id)) {
    return throwError(Messages.InvalidUUID, HttpStatusCode.NotFound)
  }

  await isExistById(id)

  const data = await findById(id)
  return {
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
  }
}
