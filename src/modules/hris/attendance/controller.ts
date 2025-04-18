import { Request, Response } from 'express'

import { getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  // deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import {
  create,
  readAll,
  readReportAttendance,
  totalPerDay,
  update,
} from './repository'
import { AttendanceSchema } from './schema'

export const saveAttendance = async (req: Request, res: Response) => {
  const parsed = AttendanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  // console.log('payload', parsed.data)
  const result = await create({ ...parsed.data, createdBy: req.user.id })
  res.json(createResponse(result, 'Kehadiran'))
}

export const updateAttendance = async (req: Request, res: Response) => {
  const parsed = AttendanceSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update({ ...parsed.data, createdBy: req.user.id })
  res.json(updateResponse(result, 'Kehadiran'))
}

// export const destroyAttendance = async (req: Request, res: Response) => {
//   const { id } = checkParamsId(req)
//   await isExist(id)

//   await destroy(id)
//   res.json(deleteResponse('Kehadiran'))
// }

export const readAttendances = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  // console.log('-------------')
  // console.log('local', req.query.startDate)
  // console.log('hasil konversi ke utc', new Date(req.query.startDate as string))
  const result = await readAll({
    page,
    limit,
    search,
    startDate: new Date(req.query.startDate as string),
  })
  res.json(successResponse(result, 'Kehadiran'))
}

export const readTotalPerDay = async (req: Request, res: Response) => {
  const result = await totalPerDay(new Date(req.query.startDate as string))
  res.json(successResponse(result, 'Total kehadiran'))
}

export const getReportAttendances = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const result = await readReportAttendance({
    page,
    limit,
    search,
    startDate: new Date(req.query.startDate as string),
    endDate: new Date(req.query.endDate as string),
  })
  res.json(successResponse(result, 'Kehadiran'))
}
