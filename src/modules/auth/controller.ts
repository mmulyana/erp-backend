import { Request, Response } from 'express'

import { LoginSchema } from './schema'
import { login } from './service'
import { CustomError } from '../../utils/error-handler'
import { successResponse } from '../../utils/response'


export const loginController = async (req: Request, res: Response) => {
  const parsed = LoginSchema.safeParse(req.body)
  if (!parsed.success) {
    const customError = new Error('Wrong input') as CustomError
    customError.status = 400
    throw customError
  }

  const result = await login(parsed.data)
  res.status(200).json(successResponse(result))
}
