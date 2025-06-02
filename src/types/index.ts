export interface CustomError extends Error {
  status?: number
  errors?: any
}

export type PaginationParams = {
  search?: string
  page?: number
  limit?: number
}

export type DateRangeParams = {
  startDate?: Date
  endDate?: Date
}
