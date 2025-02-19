export interface CustomError extends Error {
  status?: number
  errors?: any
}
