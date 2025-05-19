import { Request, Response } from 'express'

import { successResponse } from '@/utils/response'
import { getParams } from '@/utils/params'

import { findAll } from './repository'

export const getPayrolls = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const periodId = req.query.periodId ? String(req.query.periodId) : undefined
  const status = req.query.status
    ? (String(req.query.status) as any)
    : undefined

  const result = await findAll({ page, limit, search, periodId, status })
  res.json(successResponse(result, 'payroll'))
}
