import { checkParamsId, getParams } from '@/utils/params'
import { Request, Response } from 'express'
import { create, destroy, isExist, read, readAll, update } from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { ItemSchema } from './schema'
import { errorParse } from '@/utils/error-handler'

export const getInventory = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'inventory'))
}

export const getInventories = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'inventory'))
}

export const getInventoriesInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
    infinite: true,
  })
  res.json(successResponse(result, 'inventory'))
}

export const deleteInventory = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse(null, 'inventory'))
}

export const patchInventory = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = ItemSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await update(id, {
    ...parsed.data,
    createdBy: req.user.id,
    photoUrl,
  })
  res.json(updateResponse(result, 'inventory'))
}

export const postInventory = async (req: Request, res: Response) => {
  const parsed = ItemSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await create({
    ...parsed.data,
    createdBy: req.user.id,
    photoUrl,
  })
  res.json(createResponse(result, 'inventory'))
}
