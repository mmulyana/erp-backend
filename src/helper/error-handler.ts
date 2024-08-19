import { Prisma } from '@prisma/client'
import { ErrorRequestHandler } from 'express'

export const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let code = err.code || 500
  let message = 'Something went wrong'

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        message = 'Unique constraint failed on the specified field.'
        code = 409
        break
      case 'P2025':
        message = 'Record not found.'
        code = 404
        break
      case 'P2003':
        message = 'Foreign key constraint failed.'
        code = 403
        break
      default:
        message = 'Database error occurred.'
    }
  } else if (err instanceof Error) {
    message = err.message
  }

  res.status(code).json({
    status: code,
    message,
  })
}
