import { Request, Response } from 'express'
import { LoanSchema } from './schema'
import { errorParse } from '@/utils/error-handler'
import { create, findStatusByMonth, readAll } from './repository'
import { createResponse, successResponse } from '@/utils/response'
import { getParams } from '@/utils/params'
import { getQueryParam } from '@/utils'

export const postLoan = async (req: Request, res: Response) => {
  const parsed = LoanSchema.safeParse(req.body)
  if (!parsed.success) return errorParse(parsed.error)

  const photoInFiles = (req.files as Express.Multer.File[]) ?? []

  const result = await create({
    ...parsed.data,
    borrowerId: req.user.id,
    photoUrlIn: photoInFiles?.map((i) => i.filename).join(','),
  })

  res.json(createResponse(result, 'Peminjaman'))
}

export const getLoans = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = getParams(req)
  const inventoryId = getQueryParam(req.query, 'inventoryId', 'string')
  const borrowerId = getQueryParam(req.query, 'borrowerId', 'string')
  const projectId = getQueryParam(req.query, 'projectId', 'string')
  const status = getQueryParam(req.query, 'status', 'string') as any

  const result = await readAll({
    page,
    limit,
    search,
    projectId,
    status,
    sortBy,
    sortOrder,
    inventoryId,
    borrowerId,
  })
  res.json(successResponse(result, 'peminjaman'))
}

export const getStatusByMonth = async (req: Request, res: Response) => {
  const monthIndex = getQueryParam(req.query, 'month', 'number')
  const year = getQueryParam(req.query, 'year', 'number')

  const result = await findStatusByMonth({
    monthIndex,
    year: year || new Date().getFullYear(),
  })

  res.json(successResponse(result, 'Status peminjaman perbulan'))
}
