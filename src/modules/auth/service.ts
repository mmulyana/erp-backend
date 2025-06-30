import { HttpStatusCode } from 'axios'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { throwError } from '@/utils/error-handler'
import { isValidUUID } from '@/utils/is-valid-uuid'
import { Messages } from '@/utils/constant'

import { Login } from './schema'
import {
  findByEmail,
  findById,
  findByPhone,
  findByUsername,
} from './repository'

export const loginService = async (credentials: Login) => {
  const { username, password } = credentials

  const isEmail = username.includes('@')
  const isPhoneNumber = /^\d+$/.test(username)
  const isUsername = /^[a-zA-Z0-9]+$/.test(username)

  let user = null

  if (isEmail) {
    user = await findByEmail(username)
  } else if (isPhoneNumber) {
    user = await findByPhone(username)
  } else if (isUsername) {
    user = await findByUsername(username)
  }

  if (!user) {
    return throwError(Messages.AccountDoesntExists, HttpStatusCode.BadRequest)
  }

  if (!user.active) {
    return throwError(Messages.AccountNonActive, HttpStatusCode.BadRequest)
  }

  const isPasswordMatch = await compare(password, user.password)
  if (!isPasswordMatch) {
    return throwError(Messages.InvalidCredential, HttpStatusCode.BadRequest)
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET as string, {
    expiresIn: '7d',
  })

  return {
    token,
  }
}

export const findMeService = async (id: string) => {
  if (!isValidUUID(id)) {
    return throwError(Messages.InvalidUUID, HttpStatusCode.NotFound)
  }

  const data = await findById(id)
  if (!data) {
    return throwError(Messages.notFound, HttpStatusCode.NotFound)
  }

  return {
    id: data.id,
    username: data.username,
    email: data.email,
    phone: data.phone,
    photoUrl: data.photoUrl,
    role: {
      id: data.role.id,
      name: data.role.name,
    },
    permissions:
      data.role.permissions && data.role.permissions.length > 0
        ? data.role.permissions.split(',')
        : [],
  }
}
