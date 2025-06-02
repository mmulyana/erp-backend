import { Request, Response } from 'express'

import { getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import {
  create,
  readAll,
  readAttendanceByDate,
  readAttendanceChart,
  readAttendancePerDay,
  update,
} from './repository'
import { AttendanceSchema } from './schema'
import { getQueryParam } from '@/utils'

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
  const notYet = getQueryParam(req.query, 'notYet', 'boolean')
  // console.log('-------------')
  // console.log('local', req.query.startDate)
  // console.log('hasil konversi ke utc', new Date(req.query.startDate as string))
  const result = await readAll({
    page,
    limit,
    search,
    startDate: new Date(req.query.startDate as string),
    notYet,
  })
  res.json(successResponse(result, 'Kehadiran'))
}

export const getAttendanceChart = async (req: Request, res: Response) => {
  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined
  const result = await readAttendanceChart({ startDate, endDate })
  res.json(successResponse(result, 'Laporan absensi'))
}

export const getAttendanceTotal = async (req: Request, res: Response) => {
  const result = await readAttendancePerDay({
    startDate: req.query.startDate as string,
  })
  res.json(successResponse(result, 'Laporan absensi per hari'))
}

export const getAttendanceByDate = async (req: Request, res: Response) => {
  const date = req.query.date ? new Date(req.query.date as string) : undefined
  const result = await readAttendanceByDate(date)
  res.json(successResponse(result, 'Absensi harian'))
}
