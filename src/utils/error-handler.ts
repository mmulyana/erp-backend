import { NextFunction, Request, Response } from "express"

interface CustomError extends Error {
  status?: number
  data?: any
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  Next: NextFunction
) => {
  const status = error.status || 500
  res.status(status).json({
    error: error.message,
    ...(error.data && { data: error.data }),
  })
}