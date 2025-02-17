import { Request, Response } from 'express'

import { LoginSchema } from './schema'
import { login } from './service'

import { errorParse } from '@/utils/error-handler'
import { successResponse } from '@/utils/response'

export const loginController = async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await login(parsed.data)
  res.status(200).json(successResponse(result))
}
