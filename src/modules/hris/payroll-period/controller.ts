import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import { getQueryParam } from '@/utils'
import {
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import { create, readAll, read, isExist, update, destroy } from './repository'
import { PayrollPeriodSchema } from './schema'

export const postPayrollPeriod = async (req: Request, res: Response) => {
  const parsed = PayrollPeriodSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(successResponse(result, 'Periode gaji'))
}
export const patchPayrollPeriod = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = PayrollPeriodSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'Periode gaji'))
}
export const getPayrollPeriods = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = getParams(req)

  const status = getQueryParam(req.query, 'status', 'string') as any

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
  const status = getQueryParam(req.query, 'status', 'string') as any

  const result = await readAll({
    page,
    limit,
    search,
    status,
    infinite: true,
  })
  res.json(successResponse(result, 'Periode gaji'))
}
export const deletePayrollPeriod = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('Periode gaji'))
}
