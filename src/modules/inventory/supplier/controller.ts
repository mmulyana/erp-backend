import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import { create, destroy, isExist, read, readAll, update } from './repository'
import { SupplierSchema } from './schema'

export const getSupplier = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'supplier'))
}

export const getSuppliers = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'supplier'))
}

export const getSuppliersInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
    infinite: true,
  })
  res.json(successResponse(result, 'supplier'))
}

export const deleteSupplier = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse(null, 'supplier'))
}

export const patchSupplier = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = SupplierSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await update(id, {
    ...parsed.data,
    photoUrl,
  })
  res.json(updateResponse(result, 'supplier'))
}

export const postSupplier = async (req: Request, res: Response) => {
  const parsed = SupplierSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await create({
    ...parsed.data,
    photoUrl,
  })
  res.json(createResponse(result, 'supplier'))
}
