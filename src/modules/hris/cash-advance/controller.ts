import { Request, Response } from 'express'
import {
  successResponse,
  createResponse,
  updateResponse,
  deleteResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'

import { CashAdvanceSchema, CashAdvanceTransactionSchema } from './schema'
import {
  create,
  createTransaction,
  destroy,
  destroyTransaction,
  findAll,
  findAllTransaction,
  findOne,
  findOneTransaction,
  findTotalByMonth,
  isExist,
  isTransactionExist,
  update,
  updateTransaction,
} from './repository'

export const postCashAdvance = async (req: Request, res: Response) => {
  const parsed = CashAdvanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const data = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(data, 'kasbon'))
}

export const patchCashAdvance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = CashAdvanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, { ...parsed.data, createdBy: req.user.id })
  res.json(updateResponse(result, 'kasbon'))
}

export const deleteCashAdvance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('kasbon'))
}

export const getCashAdvance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'kasbon'))
}

export const getCashAdvances = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const start_date = req.params.startDate
    ? String(req.params.startDate)
    : undefined
  const end_date = req.params.endDate ? String(req.params.endDate) : undefined

  const data = await findAll(page, limit, search, start_date, end_date)
  res.json(successResponse(data, 'kasbon'))
}

export const getTotalByMonth = async (req: Request, res: Response) => {
  const month = req.query.month ? Number(req.query.month) : undefined
  const year = req.query.year ? Number(req.query.year) : undefined
  const data = await findTotalByMonth(year, month)
  res.json(successResponse(data, 'total kasbon bulan ini'))
}

// transaction
export const postCashAdvanceTransaction = async (
  req: Request,
  res: Response,
) => {
  const parsed = CashAdvanceTransactionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const data = await createTransaction(parsed.data)
  res.json(createResponse(data, 'transaksi kasbon'))
}

export const patchCashAdvanceTransaction = async (
  req: Request,
  res: Response,
) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = CashAdvanceTransactionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateTransaction(id, parsed.data)
  res.json(updateResponse(result, 'transaksi kasbon'))
}

export const deleteCashAdvanceTransaction = async (
  req: Request,
  res: Response,
) => {
  const { id } = checkParamsId(req)
  await isTransactionExist(id)

  await destroyTransaction(id)
  res.json(deleteResponse('transaksi kasbon'))
}

export const getCashAdvanceTransaction = async (
  req: Request,
  res: Response,
) => {
  const { id } = checkParamsId(req)
  await isTransactionExist(id)

  const result = await findOneTransaction(id)
  res.json(successResponse(result, 'transaksi kasbon'))
}

export const getCashAdvanceTransactions = async (
  req: Request,
  res: Response,
) => {
  const { page, limit, search } = getParams(req)
  const start_date = req.query.startDate
    ? String(req.query.startDate)
    : undefined
  const end_date = req.query.endDate ? String(req.query.endDate) : undefined
  const cashAdvanceId = req.params.id

  const data = await findAllTransaction(
    page,
    limit,
    search,
    start_date,
    end_date,
    cashAdvanceId,
  )
  res.json(successResponse(data, 'transaksi kasbon'))
}
