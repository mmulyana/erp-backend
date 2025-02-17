import { Request } from 'express'

export const getParams = (req: Request) => {
  const page = req.query.page ? Number(req.query.page) : undefined
  const limit = req.query.limit ? Number(req.query.limit) : undefined
  const search = req.query.search ? String(req.query.search) : undefined
  return { page, limit, search }
}

export const getPaginateParams = (page: number, limit: number) => {
  const skip = (page - 1) * limit
  const take = limit
  return { skip, take }
}
