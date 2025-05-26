import { Request, Response } from 'express'

import { errorParse } from '@/utils/error-handler'
import { successResponse } from '@/utils/response'

import {
  create,
  findTotalByMonth,
  isExist,
  read,
  readAll,
  update,
} from './repository'
import { StockInSchema } from './schema'
import { checkParamsId, getParams } from '@/utils/params'
import { getQueryParam } from '@/utils'

export const postStockIn = async (req: Request, res: Response) => {
  const rawItems = req.body.items
  let parsedItems

  if (typeof rawItems === 'string') {
    try {
      parsedItems = JSON.parse(rawItems)
    } catch (e) {
      return res.status(400).json({ message: 'Format items tidak valid' })
    }
  } else {
    parsedItems = rawItems
  }

  const parsed = StockInSchema.safeParse({
    ...req.body,
    date: req.body.date,
    items: parsedItems,
  })

  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const photoUrl = req.file?.filename || undefined

  const result = await create({
    ...parsed.data,
    createdBy: req.user.id,
    photoUrl,
  })

  res.json(successResponse(result, 'Stok masuk berhasil dibuat.'))
}

export const patchStockIn = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = StockInSchema.partial().safeParse({
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

  res.json(successResponse(result, 'Stok masuk'))
}

export const getStockIn = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'Detail stock in'))
}

export const getStockIns = async (req: Request, res: Response) => {
  const { page, limit, search, createdBy, sortBy, sortOrder } = getParams(req)
  const supplierId = getQueryParam(req.query, 'supplierId', 'string')

  const result = await readAll({
    limit,
    page,
    search,
    createdBy,
    sortBy,
    sortOrder,
    supplierId,
  })
  res.json(successResponse(result, 'stock in'))
}

export const getTotalByMonth = async (req: Request, res: Response) => {
  const month = Number(req.query.month) ?? new Date().getMonth()
  const year = Number(req.query.year) ?? new Date().getFullYear()

  const result = await findTotalByMonth({ monthIndex: month, year })
  res.json(successResponse(result, 'laporan total per bulan'))
}
