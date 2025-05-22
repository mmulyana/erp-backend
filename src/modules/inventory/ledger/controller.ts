import { Request, Response } from 'express'
import { readChart, readTable } from './repository'
import { successResponse } from '@/utils/response'
import { getParams } from '@/utils/params'

export const getChart = async (req: Request, res: Response) => {
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined

  const result = await readChart({
    endDate,
    startDate,
  })
  res.json(successResponse(result, 'Bagan transaksi'))
}

export const getTable = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined

  const result = await readTable({
    endDate,
    startDate,
    limit,
    page,
    search,
  })
  res.json(successResponse(result, 'Tabel transaksi'))
}
