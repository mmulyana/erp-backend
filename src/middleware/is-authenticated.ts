import db from '@/lib/prisma'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface CustomError extends Error {
  status?: number
}

interface UserPayload {
  id: string
  permissions?: string[]
}

declare module 'express' {
  interface Request {
    user?: UserPayload
  }
}

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    const error = new Error('Unauthorized') as CustomError
    error.status = 401
    return next(error)
  }

  verify(
    token,
    process.env.SECRET as string,
    async (err: any, payload: UserPayload) => {
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

      const user = await db.user.findUnique({
        where: { id: payload.id },
        include: {
          role: true,
        },
      })
      if (!user) {
        const customError = new Error() as CustomError
        customError.message = 'Akun tidak ditemukan'
        customError.status = 403
        return next(customError)
      }

      req.user = {
        id: user.id,
        permissions:
          user.role.permissions && user.role.permissions.length > 0
            ? user.role.permissions.split(',')
            : [],
      }
      next()
    },
  )
}

export default isAuthenticated
