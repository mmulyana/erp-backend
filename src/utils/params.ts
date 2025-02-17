import { Request } from 'express'
import { throwError } from './error-handler'
import { Messages } from './constant'
import { HttpStatusCode } from 'axios'

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

export const checkParamsId = (req: Request) => {
  const id = req.params.id
  if (!id) {
    return throwError(Messages.paramsIdNotFound, HttpStatusCode.BadRequest)
  }
  return { id }
}
