import db from '@/lib/prisma'
import { ResetPasswordInput, UpdateUserInput } from './schema'
import { throwError } from '@/utils/error-handler'
import { Messages } from '@/utils/constant'
import { HttpStatusCode } from 'axios'
import { deleteFile } from '@/utils/file'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

export const updateUser = async (
  id: string,
  data: UpdateUserInput & { photoUrl?: string },
) => {
  const existing = await db.user.findUnique({
    where: { id, deletedAt: null },
  })

  if (!existing) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }

  if (existing.photoUrl !== data.photoUrl) {
    await deleteFile(existing.photoUrl)
  }

  return db.user.update({
    where: { id },
    data,
  })
}

export const changePassword = async (id: string, input: ResetPasswordInput) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      password: true,
      deletedAt: true,
    },
  })

  if (!user || user.deletedAt) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }

  const isMatch = await bcrypt.compare(input.oldPassword, user.password)
  if (!isMatch) {
    return throwError('INVALID_OLD_PASSWORD', HttpStatusCode.BadRequest)
  }

  const hashed = await bcrypt.hash(input.newPassword, 10)

  return db.user.update({
    where: { id },
    data: {
      password: hashed,
    },
  })
}

export const resetPassword = async (id: string) => {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      password: true,
      deletedAt: true,
    },
  })

  if (!user || user.deletedAt) {
    return throwError(Messages.notFound, HttpStatusCode.BadRequest)
  }

  const hashed = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10)

  return db.user.update({
    where: { id },
    data: {
      password: hashed,
    },
  })
}
