export interface CustomRequest extends Request {
  user?: any
}

export interface CustomError extends Error {
  status?: number
  errors?: any
}
