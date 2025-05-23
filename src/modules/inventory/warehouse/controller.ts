import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import {
  create,
  destroy,
  isExist,
  read,
  readAll,
  readTotal,
  update,
} from './repository'
import { LocationSchema } from './schema'

export const getLocation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'lokasi'))
}

export const getLocations = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'lokasi'))
}

export const getLocationsInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
    infinite: true,
  })
  res.json(successResponse(result, 'lokasi'))
}

export const deleteLocation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse(null, 'lokasi'))
}

export const patchLocation = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = LocationSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await update(id, {
    ...parsed.data,
    createdBy: req.user.id,
    photoUrl,
  })
  res.json(updateResponse(result, 'lokasi'))
}

export const postLocation = async (req: Request, res: Response) => {
  const parsed = LocationSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await create({
    ...parsed.data,
    photoUrl,
  })
  res.json(createResponse(result, 'lokasi'))
}

export const getTotal = async (req: Request, res: Response) => {
  const result = await readTotal()
  res.json(successResponse(result, 'Barang hampir habis'))
}
