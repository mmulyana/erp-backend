import { Request, Response } from 'express'

import { ClientSchema } from './schema'
import {
  create,
  destroy,
  isExist,
  read,
  readAll,
  readClientRank,
  update,
} from './repository'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import { getQueryParam } from '@/utils'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

export const saveClient = async (req: Request, res: Response) => {
  const parsed = ClientSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create(parsed.data)
  res.json(createResponse(result, 'klien baru'))
}

export const updateClient = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = ClientSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'klien'))
}

export const destroyClient = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('klien'))
}

export const readClient = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'klien'))
}

export const readClients = async (req: Request, res: Response) => {
  const { page, limit, search, sortOrder } = getParams(req)
  const companyId = getQueryParam(req.query, 'companyId', 'string')

  const result = await readAll({
    page,
    limit,
    search,
    companyId,
    sortOrder,
  })

  res.json(successResponse(result, 'klien'))
}

export const readClientsInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const companyId = getQueryParam(req.query, 'companyId', 'string')

  const result = await readAll({
    page,
    limit,
    search,
    companyId,
    infinite: true,
  })

  res.json(successResponse(result, 'klien'))
}

export const getClientRank = async (req: Request, res: Response) => {
  const { limit, sortOrder } = getParams(req)

  const result = await readClientRank({
    sortOrder: sortOrder as 'asc' | 'desc',
    limit,
  })
  res.json(successResponse(result, 'rangking klien'))
}
