import { Request, Response } from 'express'

import { errorParse } from '@/utils/error-handler'
import { updateResponse } from '@/utils/response'
import { checkParamsId } from '@/utils/params'

import { resetPasswordSchema, updateUserSchema } from './schema'
import { changePassword, resetPassword, updateUser } from './repository'

export const patchInfo = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  const parsed = updateUserSchema.safeParse(req.body)
  if (!parsed.success) errorParse(parsed.error)

  let photoUrl: string | null | undefined = undefined

  if (req.file?.filename) {
    photoUrl = req.file.filename
  } else if (parsed.data.photoUrl !== undefined) {
    photoUrl = parsed.data.photoUrl
  } else {
    photoUrl = null
  }

  await updateUser(id, { ...parsed.data, photoUrl })
  res.json(updateResponse(null, 'Akun'))
}

export const patchPassword = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const parsed = resetPasswordSchema.safeParse(req.body)
  if (!parsed.success) return errorParse(parsed.error)

  await changePassword(id, parsed.data)
  res.json(updateResponse(null, 'Password'))
}

export const patchResetPassword = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  
  await resetPassword(id)
  res.json(updateResponse(null, 'Password berhasil direset'))
}
