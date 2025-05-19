import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import { successResponse } from '@/utils/response'

import { create, findAll, findOne, isExist } from './repository'
import { PayrollPeriodSchema } from './schema'

export const postPeriod = async (req: Request, res: Response) => {
  const parsed = PayrollPeriodSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(successResponse(result, 'Periode gaji'))
}

export const getPeriods = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await findAll({
    page,
    limit,
    search,
    startDate: (req.query.startDate as string) || undefined,
    endDate: (req.query.endDate as string) || undefined,
  })
  res.json(successResponse(result, 'Periode gaji'))
}
export const getPeriod = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'Periode gaji'))
}
