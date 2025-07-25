import { checkParamsId, getParams } from '@/utils/params'
import { Request, Response } from 'express'
import {
  create,
  destroy,
  findSupplierByItemId,
  isExist,
  read,
  readAll,
  readLowStock,
  readStatusChart,
  readTotal,
  update,
} from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { errorParse } from '@/utils/error-handler'
import { getQueryParam } from '@/utils'

import { ItemSchema } from './schema'

export const getInventory = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'inventory'))
}

export const getInventories = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = getParams(req)
  const brandId = getQueryParam(req.query, 'brandId', 'string')
  const warehouseId = getQueryParam(req.query, 'warehouseId', 'string')
  const status = getQueryParam(req.query, 'status', 'string') as any
  const type = getQueryParam(req.query, 'type', 'string')

  const result = await readAll({
    limit,
    page,
    search,
    sortBy,
    sortOrder,
    brandId,
    warehouseId,
    status,
    type,
  })
  res.json(successResponse(result, 'inventory'))
}

export const getInventoriesInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const type = getQueryParam(req.query, 'type', 'string')

  const result = await readAll({
    limit,
    page,
    search,
    infinite: true,
    type,
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
  let photoUrl: string | null | undefined = undefined

  if (req.file?.filename) {
    photoUrl = req.file.filename
  } else if (parsed.data.photoUrl !== undefined) {
    photoUrl = parsed.data.photoUrl
  } else {
    photoUrl = null
  }

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

export const getStatusChart = async (req: Request, res: Response) => {
  const result = await readStatusChart()
  res.json(successResponse(result, 'Bagan status'))
}

export const getLowStock = async (req: Request, res: Response) => {
  const result = await readLowStock()
  res.json(successResponse(result, 'Barang hampir habis'))
}

export const getTotal = async (req: Request, res: Response) => {
  const result = await readTotal()
  res.json(successResponse(result, 'Barang hampir habis'))
}

export const getSupplierById = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findSupplierByItemId(id)
  res.json(successResponse(result, 'supplier barang'))
}
