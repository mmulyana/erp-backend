import { HttpStatusCode } from 'axios'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
  findByEmail,
  findById,
  findByPhone,
  findByUsername,
} from './repository'
import { throwError } from '../../utils/error-handler'
import { Messages } from '../../utils/constant'

import { Login } from './schema'
import { isValidUUID } from '@/utils/is-valid-uuid'

export const loginService = async (credentials: Login) => {
  const { email, username, password, phone } = credentials

  let user
  if (email) {
    user = await findByEmail(email)
  } else if (username) {
    user = await findByUsername(username)
  } else if (phone) {
    user = await findByPhone(phone)
  }

  if (!user) {
    return throwError(Messages.AccountDoesntExists, HttpStatusCode.BadRequest)
  }

  if (!user || !(await compare(password, user.password))) {
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
    role: data.role,
    permissions: data.role?.permissionRole?.map((item) => item.permission.key) || [],
    tours: data.tours.map((item) => item.key),
  }
}
