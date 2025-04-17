import {
  create,
  destroy,
  findAll,
  findOne,
  isExist,
  totalPerDay,
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

export const saveOvertime = async (req: Request, res: Response) => {
  const parsed = OvertimeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(result, 'lembur'))
}

export const updateOvertime = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = OvertimeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, { ...parsed.data, createdBy: req.user.id })
  res.json(updateResponse(result, 'lembur'))
}

export const destroyOvertime = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('lembur'))
}

export const readOvertimes = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await findAll({
    page,
    limit,
    search,
    startDate: new Date(req.query.startDate as string),
  })
  res.json(successResponse(result, 'lembur'))
}

export const readOvertime = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'lembur'))
}

export const readTotalPerDay = async (req: Request, res: Response) => {
  const result = await totalPerDay(new Date(req.query.startDate as string))
  res.json(successResponse(result, 'Total kehadiran'))
}
