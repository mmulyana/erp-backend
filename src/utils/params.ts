import { Request } from 'express'
import { throwError } from './error-handler'
import { Messages } from './constant'
import { HttpStatusCode } from 'axios'
import { getQueryParam } from '.'

export const getParams = (req: Request) => {
  const page = getQueryParam(req.query, 'page', 'number')
  const limit = getQueryParam(req.query, 'limit', 'number')
  const search = getQueryParam(req.query, 'search', 'string')
  const sortBy = getQueryParam(req.query, 'sortBy', 'string') as any
  const sortOrder = getQueryParam(req.query, 'sortOrder', 'string') as any
  const createdBy = getQueryParam(req.query, 'createdBy', 'string')

  return { page, limit, search, sortBy, sortOrder, createdBy }
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
