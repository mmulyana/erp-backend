import { Request, Response } from 'express'

import { LoginSchema } from './schema'
import { findMeService, loginService } from './service'

import { errorParse } from '@/utils/error-handler'
import { successResponse } from '@/utils/response'

export const login = async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await loginService(parsed.data)
  res.status(200).json(successResponse(result))
}

export const findMe = async (req: Request, res: Response) => {
  const result = await findMeService(req.user.id as string)
  res.json(successResponse(result, 'me'))
}
