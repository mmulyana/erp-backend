import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { findByEmail, findByPhone, findByUsername } from './repository'
import { Login } from './schema'
import { CustomError } from '../../utils/error-handler'

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
    const error = new Error('akun tidak ada') as CustomError
    error.status = 400
    throw error
  }

  if (!user || !(await compare(password, user.password))) {
    const error = new Error('Kredensial salah') as CustomError
    error.status = 400
    throw error
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
