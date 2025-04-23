import { Request, Response } from 'express'

import { ClientSchema } from './schema'
import {
  create,
  destroy,
  isExist,
  read,
  readAll,
  topClients,
  update,
} from './repository'

import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { errorParse } from '@/utils/error-handler'
import { checkParamsId, getParams } from '@/utils/params'

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
  const { page, limit, search } = getParams(req)
  const companyId = req.params.companyId
    ? String(req.params.companyId)
    : undefined

  const result = await readAll({
    page,
    limit,
    search,
    companyId,
  })

  res.json(successResponse(result, 'klien'))
}

export const readClientsInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const companyId = req.params.companyId
    ? String(req.params.companyId)
    : undefined

  const result = await readAll({
    page,
    limit,
    search,
    companyId,
    infinite: true,
  })

  res.json(successResponse(result, 'klien'))
}

export const readTopClient = async (req: Request, res: Response) => {
  const result = await topClients()
  res.json(successResponse(result, 'top klien'))
}
