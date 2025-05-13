import { Request, Response } from 'express'

import { errorParse } from '@/utils/error-handler'
import { createResponse, successResponse } from '@/utils/response'
import { parseJsonField } from '@/utils'

import { StockOutSchema } from './schema'
import { create, findTotalByMonth, isExist, read, readAll } from './repository'
import { checkParamsId, getParams } from '@/utils/params'

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

export const getTotalByMonth = async (req: Request, res: Response) => {
  const month = Number(req.query.month) ?? new Date().getMonth()
  const year = Number(req.query.year) ?? new Date().getFullYear()

  const result = await findTotalByMonth({ monthIndex: month, year })
  res.json(successResponse(result, 'laporan total per bulan'))
}
