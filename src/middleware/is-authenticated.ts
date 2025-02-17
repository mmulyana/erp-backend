import { NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'

import { CustomError, CustomRequest } from '@/types'

const isAuthenticated = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.get('authorization')?.split(' ')[1]

  if (!token) {
    throw new Error('Unauthorized')
  }

  verify(
    token,
    process.env.SECRET as string,
    (err: any, payload: any): void => {
      if (err) {
        const customError = new Error() as CustomError
        if (err.name === 'TokenExpiredError') {
          customError.message = 'Token expired'
          customError.status = 401
        } else {
          customError.message = 'Token Invalid'
          customError.status = 403
        }
        throw customError
      }

      req.user = payload
      next()
    },
  )
}

export default isAuthenticated
