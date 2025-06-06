import {
  create,
  destroy,
  findAll,
  findOne,
  isExist,
  readOvertimeByDate,
  readOvertimeChart,
  update,
} from './repository'
import { Request, Response } from 'express'
import { OvertimeSchema } from './schema'
import {
  successResponse,
  createResponse,
  deleteResponse,
  updateResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import { getQueryParam } from '@/utils'

export const postOvertime = async (req: Request, res: Response) => {
  const parsed = OvertimeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(result, 'lembur'))
}

export const patchOvertime = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = OvertimeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, { ...parsed.data, createdBy: req.user.id })
  res.json(updateResponse(result, 'lembur'))
}

export const deleteOvertime = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('lembur'))
}

export const getOvertimes = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = getParams(req)
  const position = getQueryParam(req.query, 'position', 'string')
  const projectId = getQueryParam(req.query, 'projectId', 'string')

  const result = await findAll({
    page,
    limit,
    search,
    startDate: new Date(req.query.startDate as string),
    sortBy,
    sortOrder,
    position,
    projectId,
  })
  res.json(successResponse(result, 'lembur'))
}

export const getOvertime = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'lembur'))
}

export const getOvertimeChart = async (req: Request, res: Response) => {
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined
  const result = await readOvertimeChart({ startDate, endDate })
  res.json(successResponse(result, 'Laporan lembur'))
}

export const getOvertimeByDate = async (req: Request, res: Response) => {
  const date = req.query.date ? new Date(req.query.date as string) : undefined
  const result = await readOvertimeByDate(date)
  res.json(successResponse(result, 'Lembur harian'))
}
