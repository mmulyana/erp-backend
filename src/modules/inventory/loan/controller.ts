import { Request, Response } from 'express'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import { getQueryParam } from '@/utils'
import {
  createResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import { LoanSchema } from './schema'
import {
  create,
  findStatusByMonth,
  isExist,
  read,
  readAll,
  update,
} from './repository'

export const postLoan = async (req: Request, res: Response) => {
  const parsed = LoanSchema.safeParse(req.body)
  if (!parsed.success) return errorParse(parsed.error)

  const photoInFiles = (req.files as Express.Multer.File[]) ?? []

  const result = await create({
    ...parsed.data,
    borrowerId: req.user.id,
    photoUrlIn: photoInFiles?.map((i) => i.filename).join('|'),
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

export const getLoan = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
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

export const patchLoan = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = LoanSchema.partial().safeParse(req.body)
  if (!parsed.success) return errorParse(parsed.error)

  const payload = parsed.data

  let photoUrl: string | null | undefined = undefined

  if (req.file?.filename) {
    photoUrl = req.file.filename
  } else if (parsed.data.photoUrlIn !== undefined) {
    photoUrl = parsed.data.photoUrlIn
  } else {
    photoUrl = null
  }

  const result = await update(id, {
    note: payload.note,
    photoUrlIn: photoUrl,
    requestDate: payload.requestDate,
  })

  res.json(updateResponse(result, 'Peminjaman'))
}
