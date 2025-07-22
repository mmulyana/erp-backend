import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { customResponse, successResponse } from '@/utils/response'

import {
  findProgressByPeriodId,
  findTotalAmount,
  isExist,
  readAll,
  readOne,
  update,
} from './repository'
import { PayrollSchema } from './schema'
import { errorParse } from '@/utils/error-handler'

export const getPayrolls = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const periodId = req.query.periodId ? String(req.query.periodId) : undefined
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
    periodId,
    status,
    sortBy,
    sortOrder,
  })
  res.json(successResponse(result, 'payroll'))
}

export const getPayroll = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await readOne(id)
  res.json(successResponse(result, 'payroll detail'))
}

export const patchPayroll = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = PayrollSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(customResponse(result, 'Gaji selesai diproses'))
}

export const getTotalAmount = async (req: Request, res: Response) => {
  const month = req.query.month ? Number(req.query.month) : undefined
  const periodId = req.query.periodId ? String(req.query.periodId) : undefined

  const result = await findTotalAmount({
    monthIndex: month,
    periodId,
  })

  res.json(successResponse(result, 'Total pengeluaran'))
}

export const getProgressByPeriodId = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const result = await findProgressByPeriodId(id)
  res.json(successResponse(result, 'Progress payroll'))
}
