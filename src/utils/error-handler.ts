import { NextFunction, Request, Response } from 'express'

import { Messages } from './constant'

import { CustomError } from '../types'
import { HttpStatusCode } from 'axios'

import { ZodError } from 'zod'

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

export const errorParse = (data?: ZodError) => {
  const customError = new Error(Messages.BadRequest) as CustomError
  customError.status = HttpStatusCode.BadRequest
  if (data)
    customError.errors = data.errors.map((err) => ({
      code: err.code,
      path: err.path,
      message: err.message,
    }))

  throw customError
}

export const throwError = (message: string, status: number) => {
  const error = new Error(message) as CustomError
  error.status = status
  throw error
}