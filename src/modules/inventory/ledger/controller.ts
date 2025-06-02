import { Request, Response } from 'express'

import { successResponse } from '@/utils/response'
import { getParams } from '@/utils/params'
import { getQueryParam } from '@/utils'

import { readAll, readChart, readTable } from './repository'

export const getChart = async (req: Request, res: Response) => {
  const startDate = getQueryParam(req.query, 'startDate', 'string')
  const endDate = getQueryParam(req.query, 'endDate', 'string')

  const result = await readChart({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  })
  res.json(successResponse(result, 'Bagan transaksi'))
}

export const getTable = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const startDate = getQueryParam(req.query, 'startDate', 'string')
  const endDate = getQueryParam(req.query, 'endDate', 'string')

  const result = await readTable({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'Tabel transaksi'))
}

export const getLedgers = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = getParams(req)
  const itemId = getQueryParam(req.query, 'itemId', 'string')
  const type = getQueryParam(req.query, 'type', 'string') as any

  const result = await readAll({
    page,
    limit,
    search,
    itemId,
    sortBy,
    sortOrder,
    type,
  })

  res.json(successResponse(result, 'ledger'))
}
