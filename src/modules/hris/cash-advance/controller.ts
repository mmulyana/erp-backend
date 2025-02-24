import { Request, Response, NextFunction } from 'express'
import { CashAdvanceSchema } from './schema'
import {
  successResponse,
  createResponse,
  updateResponse,
  deleteResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  create,
  destroy,
  findAll,
  findOne,
  isExist,
  readTotal,
  readTotalInYear,
  update,
} from './repository'

export const saveCashAdvance = async (req: Request, res: Response) => {
  const parsed = CashAdvanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const data = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(data, 'kasbon'))
}

export const updateCashAdvance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = CashAdvanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, { ...parsed.data, createdBy: req.user.id })
  res.json(updateResponse(result, 'kasbon'))
}

export const destroyCashAdvance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('kasbon'))
}

export const readCashAdvance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'kasbon'))
}

export const readCashAdvances = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const start_date = req.params.startDate
    ? String(req.params.startDate)
    : undefined
  const end_date = req.params.endDate ? String(req.params.endDate) : undefined

  const data = await findAll(page, limit, search, start_date, end_date)
  res.json(successResponse(data, 'kasbon'))
}

export const getTotal = async (req: Request, res: Response) => {
  const result = await readTotal()
  res.json(successResponse(result, 'jumlah kasbon'))
}

export const getTotalInYear = async (req: Request, res: Response) => {
  const total = req.params.total ? Number(req.params.total) : undefined
  const data = await readTotalInYear(total)
  res.json(successResponse(data, 'jumlah kasbon'))
}
