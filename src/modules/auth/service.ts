import { HttpStatusCode } from 'axios'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { findByEmail, findByPhone, findByUsername } from './repository'
import { throwError } from '../../utils/error-handler'
import { Messages } from '../../utils/constant'

import { Login } from './schema'

export const login = async (credentials: Login) => {
  const { email, username, password, phone } = credentials

  let user
  if (email) {
    user = await findByEmail(email)
  } else if (username) {
    user = await findByUsername(username)
  } else if (phone) {
    user = await findByPhone(phone)
  }

  if (!user?.active) {
    return throwError(Messages.AccountDoesntExists, HttpStatusCode.BadRequest)
  }

  if (!user || !(await compare(password, user.password))) {
    return throwError(Messages.InvalidCredential, HttpStatusCode.BadRequest)
  }

  const token = jwt.sign(
    { id: user.id, name: user.username },
    process.env.SECRET as string,
    { expiresIn: '7d' },
  )

  return {
    token,
  }
}
