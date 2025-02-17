import { NextFunction, Request, Response } from 'express'

export interface CustomError extends Error {
  status?: number
  errors?: any
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status || 500
  res.status(status).json({
    message: error.message,
    ...(error.errors && { errors: error.errors }),
  })
}
