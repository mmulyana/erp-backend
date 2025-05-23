import { Request, Response } from 'express'
import { LoanSchema } from './schema'
import { errorParse } from '@/utils/error-handler'
import { create, readAll } from './repository'
import { createResponse, successResponse } from '@/utils/response'
import { getParams } from '@/utils/params'

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
  const { page, limit, search } = getParams(req)
  const projectId = req.query.projectId
    ? String(req.query.projectId)
    : undefined
  const status = req.query.status
    ? (String(req.query.status) as any)
    : undefined
  const sortBy = req.query.sortBy
    ? (String(req.query.sortBy) as any)
    : undefined
  const sortOrder = req.query.sortOrder
    ? (String(req.query.sortOrder) as any)
    : undefined
  const inventoryId = req.query.inventoryId
    ? (String(req.query.inventoryId) as any)
    : undefined
  const borrowerId = req.query.borrowerId
    ? (String(req.query.borrowerId) as any)
    : undefined

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
