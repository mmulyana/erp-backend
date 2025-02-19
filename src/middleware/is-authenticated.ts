import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface CustomError extends Error {
  status?: number
}

interface UserPayload {
  id: string
}

declare module 'express' {
  interface Request {
    user?: UserPayload
  }
}

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    const error = new Error('Unauthorized') as CustomError
    error.status = 401
    return next(error)
  }

  verify(
    token,
    process.env.SECRET as string,
    (err: any, payload: UserPayload): void => {
      if (err) {
        const customError = new Error() as CustomError
        if (err.name === 'TokenExpiredError') {
          customError.message = 'Token expired'
          customError.status = 401
        } else {
          customError.message = 'Token Invalid'
          customError.status = 403
        }
        return next(customError)
      }

      req.user = payload
      next()
    },
  )
}

export default isAuthenticated
