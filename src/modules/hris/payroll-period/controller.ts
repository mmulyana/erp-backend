import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import { successResponse } from '@/utils/response'

import { create, readAll, read, isExist } from './repository'
import { PayrollPeriodSchema } from './schema'

export const postPayrollPeriod = async (req: Request, res: Response) => {
  const parsed = PayrollPeriodSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(successResponse(result, 'Periode gaji'))
}
export const getPayrollPeriods = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const status = req.query.status
    ? (String(req.query.status) as any)
    : undefined
  const sortBy = req.query.sortBy
    ? (String(req.query.sortBy) as any)
    : undefined
  const sortOrder = req.query.sortOrder
    ? (String(req.query.sortOrder) as any)
    : undefined

  const result = await readAll({
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    status,
  })
  res.json(successResponse(result, 'Periode gaji'))
}
export const getPayrollPeriod = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'Periode gaji'))
}
export const getPayrollPeriodsInfinite = async (
  req: Request,
  res: Response,
) => {
  const { page, limit, search } = getParams(req)

  const status = req.query.status
    ? (String(req.query.status) as any)
    : undefined

  const result = await readAll({
    page,
    limit,
    search,
    status,
    infinite: true,
  })
  res.json(successResponse(result, 'Periode gaji'))
}
