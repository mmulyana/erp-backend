import { Request, Response } from 'express'

import { errorParse } from '@/utils/error-handler'
import { createResponse, successResponse } from '@/utils/response'
import { getQueryParam, parseJsonField } from '@/utils'

import { StockOutSchema } from './schema'
import {
  create,
  findTotalByMonth,
  isExist,
  read,
  readAll,
  update,
} from './repository'
import { checkParamsId, getParams } from '@/utils/params'
import { z } from 'zod'

export const postStockOut = async (req: Request, res: Response) => {
  // console.log('_________')
  // console.log('req.body', req.body)
  req.body.items = parseJsonField(req.body.items)

  const parsed = StockOutSchema.safeParse({
    ...req.body,
    date: req.body.date,
  })

  if (!parsed.success) return errorParse(parsed.error)

  // console.log('_________')
  // console.log('parsed.data', parsed.data)

  const photoUrl = req.file?.filename
  const data = await create({
    ...parsed.data,
    projectId: parsed.data.projectId,
    createdBy: req.user.id,
    photoUrl,
  })

  return res.json(createResponse(data, 'Stok keluar'))
}

export const patchStockOut = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = StockOutSchema.extend({
    photoUrl: z.any(),
  })
    .partial()
    .safeParse({
      ...req.body,
      date: req.body.date,
    })

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
    photoUrl,
  })

  res.json(successResponse(result, 'stok keluar'))
}

export const getStockOut = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'Detail stock out'))
}

export const getStockOuts = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder, createdBy } = getParams(req)
  const projectId = getQueryParam(req.query, 'projectId', 'string')

  const result = await readAll({
    limit,
    page,
    search,
    sortBy,
    sortOrder,
    createdBy,
    projectId,
  })
  res.json(successResponse(result, 'stock out'))
}

export const getTotalByMonth = async (req: Request, res: Response) => {
  const month = Number(req.query.month) ?? new Date().getMonth()
  const year = Number(req.query.year) ?? new Date().getFullYear()

  const result = await findTotalByMonth({ monthIndex: month, year })
  res.json(successResponse(result, 'laporan total per bulan'))
}
