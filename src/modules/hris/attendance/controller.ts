import { Request, Response } from 'express'
import { AttendanceSchema } from './schema'
import { errorParse } from '@/utils/error-handler'
import { create, destroy, isExist, readAll, update } from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { checkParamsId } from '@/utils/params'
import { endOfDay } from 'date-fns'

export const saveAttendance = async (req: Request, res: Response) => {
  const parsed = AttendanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(result, 'Kehadiran'))
}

export const updateAttendance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = AttendanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'Kehadiran'))
}

export const destroyAttendance = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('Kehadiran'))
}

export const readAttendances = async (req: Request, res: Response) => {
  const { date, search, positionId, endDate } = req.query
  const localDate = endOfDay(new Date())

  const start_date = date ? new Date(String(date)) : new Date(localDate)
  const end_date = endDate ? new Date(String(endDate)) : undefined
  const position_id = positionId ? String(positionId) : undefined
  const search_query = search ? String(search) : undefined

  const result = await readAll(start_date, end_date, position_id, search_query)
  res.json(successResponse(result, 'Kehadiran'))
}
