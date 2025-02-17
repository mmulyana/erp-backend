import { Request, Response } from 'express'

import { LoginSchema } from './schema'
import { login } from './service'

import { successResponse } from '../../utils/response'
import { errorParse } from '../../utils/error-handler'

export const loginController = async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await login(parsed.data)
  res.status(200).json(successResponse(result))
}
