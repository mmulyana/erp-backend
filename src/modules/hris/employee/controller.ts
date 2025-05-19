import { Request, Response } from 'express'
import { HttpStatusCode } from 'axios'

import { errorParse, throwError } from '@/utils/error-handler'
import { checkParamsId, getParams } from '@/utils/params'
import {
  isExist,
  update,
  create,
  destroy,
  read,
  readAll,
  readAllInfinite,
  findCertificates,
  findCertificate,
  isCertifExist,
  destroyCertificate,
  createCertificate,
  updateCertificate,
  findAttendanceById,
  findOvertimeById,
  findCashAdvancesById,
  findChartCashAdvancesById,
  destroyPhoto,
  findTotalEmployee,
  findLastEducation,
  findSummaryById,
} from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

import { CertificationSchema, EmployeeSchema } from './schema'

// employee
export const postEmployee = async (req: Request, res: Response) => {
  const parsed = EmployeeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const photoUrl = req?.file?.filename || undefined

  const result = await create({ ...parsed.data, photoUrl })
  res.json(createResponse(result, 'pegawai'))
}
export const patchEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = EmployeeSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const photoUrl = req?.file?.filename || undefined

  const result = await update(id, { ...parsed.data, photoUrl })
  res.json(updateResponse(result, 'pegawai'))
}
export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('pegawai'))
}
export const getEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'pegawai'))
}
export const getEmployees = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const position = req.params.position ? String(req.params.position) : undefined

  const result = await readAll(page, limit, search, position, active)
  res.json(successResponse(result, 'pegawai'))
}
export const getEmployeesInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const positionId = req.params.positionId
    ? String(req.params.positionId)
    : undefined

  const result = await readAllInfinite(
    page,
    limit || 10,
    search,
    positionId,
    active,
  )
  res.json(successResponse(result, 'pegawai'))
}
export const patchDestroyPhoto = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await destroyPhoto(id)
  res.json(updateResponse(result, 'photo pegawai'))
}

// certification
export const postCertificate = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const fileUrl = req.file.filename
  if (!fileUrl) {
    return throwError('File tidak boleh kosong', HttpStatusCode.BadRequest)
  }

  const parsed = CertificationSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await createCertificate(id, { ...parsed.data, fileUrl })
  res.json(createResponse(result, 'sertifikat pegawai'))
}
export const patchCertificate = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isCertifExist(id)

  const parsed = CertificationSchema.partial().safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const fileUrl = req.file?.filename
  const changeFile = !!fileUrl

  const result = await updateCertificate(req.params.id, {
    ...parsed.data,
    fileUrl,
    changeFile,
  })
  res.json(updateResponse(result, 'sertifikat pegawai'))
}
export const deleteCertificate = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isCertifExist(id)

  await destroyCertificate(id)
  res.json(deleteResponse('sertifikat pegawai'))
}
export const getCertificates = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const { page, limit, search } = getParams(req)
  const result = await findCertificates({
    limit,
    page,
    search,
    id,
  })
  res.json(successResponse(result, 'sertifikasi pegawai'))
}
export const getCertificate = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  const result = await findCertificate(id)
  res.json(successResponse(result, 'sertifikat'))
}

// DETAIL
export const getAttendancesById = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findAttendanceById({
    employeeId: id,
    startMonth: Number(req.query.startMonth as string),
    endMonth: Number(req.query.endMonth as string),
    year: Number(req.query.year as string),
  })

  res.json(successResponse(result, 'absensi pegawai'))
}
export const getOvertimesById = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined

  const { page, limit, search } = getParams(req)

  const result = await findOvertimeById({
    employeeId: id,
    startDate,
    endDate,
    limit,
    page,
    search,
  })

  res.json(successResponse(result, 'lembur pegawai'))
}
export const getCashAdvancesById = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const { page, limit, search } = getParams(req)

  const result = await findCashAdvancesById({
    employeeId: id,
    limit,
    page,
    search,
  })

  res.json(successResponse(result, 'kasbon pegawai'))
}
export const getChartCashAdvancesById = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findChartCashAdvancesById(id)

  res.json(successResponse(result, 'chart kasbon pegawai'))
}
export const getTotalEmployee = async (req: Request, res: Response) => {
  const result = await findTotalEmployee()
  res.json(successResponse(result, 'Total pegawai'))
}
export const getLastEducation = async (req: Request, res: Response) => {
  const result = await findLastEducation()
  res.json(successResponse(result, 'Pendidikan terakhir'))
}
export const getSummaryById = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const startDate = req.query.startDate
    ? new Date(req.query.startDate as string)
    : undefined
  const endDate = req.query.endDate
    ? new Date(req.query.endDate as string)
    : undefined

  const result = await findSummaryById({
    id,
    startDate,
    endDate,
  })

  res.json(successResponse(result, 'ringkasan pegawai'))
}
