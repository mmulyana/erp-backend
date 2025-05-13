import { Request, Response } from 'express'

import { errorParse } from '@/utils/error-handler'
import { createResponse, successResponse } from '@/utils/response'
import { parseJsonField } from '@/utils'

import { StockOutSchema } from './schema'
import { create, read, readAll } from './repository'
import { checkParamsId, getParams } from '@/utils/params'
import { isExist } from '../item/repository'

export const postStockOut = async (req: Request, res: Response) => {
  req.body.items = parseJsonField(req.body.items)

  const parsed = StockOutSchema.safeParse({
    ...req.body,
    date: req.body.date,
  })
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const photoUrl = req.file?.filename
  const data = await create({
    ...parsed.data,
    createdBy: req.user.id,
    photoUrl,
  })

  return res.json(createResponse(data, 'Stok keluar'))
}

export const getStockOut = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'Detail stock out'))
}

export const getStockOuts = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await readAll({
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'stock out'))
}
