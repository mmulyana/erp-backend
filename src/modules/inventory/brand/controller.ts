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
import { BrandSchema } from './schema'

export const getBrand = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'merek'))
}

export const getBrands = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'merek'))
}

export const getBrandsInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
    infinite: true,
  })
  res.json(successResponse(result, 'merek'))
}

export const deleteBrand = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse(null, 'merek'))
}

export const patchBrand = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = BrandSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await update(id, {
    ...parsed.data,
    createdBy: req.user.id,
    photoUrl,
  })
  res.json(updateResponse(result, 'merek'))
}

export const postBrand = async (req: Request, res: Response) => {
  const parsed = BrandSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await create({
    ...parsed.data,
    photoUrl,
  })
  res.json(createResponse(result, 'merek'))
}
