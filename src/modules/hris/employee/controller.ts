import { Request, Response } from 'express'
import { HttpStatusCode } from 'axios'

import {
  read,
  create,
  destroy,
  isExist,
  update,
  readAll,
  addPhoto,
  deletePhoto,
  readExpireSafety,
  updateCertification,
  createCertification,
  deleteCertification,
  readExpireCertificate,
  readAllInfinite,
} from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'
import { errorParse, throwError } from '@/utils/error-handler'

import { CertificationSchema, EmployeeSchema } from './schema'

export const saveEmployee = async (req: Request, res: Response) => {
  const parsed = EmployeeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const photoUrl = req?.file?.filename || undefined

  const result = await create({ ...parsed.data, photoUrl })
  res.json(createResponse(result, 'pegawai'))
}
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = EmployeeSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'pegawai'))
}
export const destroyEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('pegawai'))
}
export const readEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'pegawai'))
}
export const readEmployees = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const positionId = req.params.positionId
    ? String(req.params.positionId)
    : undefined

  const result = await readAll(page, limit, search, positionId, active)
  res.json(successResponse(result, 'pegawai'))
}
export const readEmployeesInfinite = async (req: Request, res: Response) => {
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
export const uploadPhotoEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  if (!req.file.filename) {
    return throwError('photo belum dikirim', HttpStatusCode.BadRequest)
  }

  await addPhoto(id, req.file.filename)
  res.json(createResponse({}, 'photo pegawai'))
}
export const deletePhotoEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await deletePhoto(id)
  res.json(deleteResponse('photo pegawai'))
}

export const saveCertifEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const fileUrl = req.body.filename
  if (!fileUrl) {
    return throwError('File tidak terupload', HttpStatusCode.BadRequest)
  }

  const parsed = CertificationSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await createCertification(id, { ...parsed.data, fileUrl })
  res.json(createResponse(result, 'sertifikat pegawai'))
}

export const updateCertifEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const fileUrl = req.body.filename || undefined

  const parsed = CertificationSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateCertification(req.params.id, {
    ...parsed.data,
    fileUrl,
  })
  res.json(updateResponse(result, 'sertifikat pegawai'))
}

export const destoryCertifEmployee = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const certifId = req.params.certifId
  if (!certifId) {
    return throwError('id sertifikasi harus ada', HttpStatusCode.BadRequest)
  }

  await deleteCertification(certifId)
  res.json(deleteResponse('sertifikat pegawai'))
}
export const readExpireCertifEmployee = async (req: Request, res: Response) => {
  const result = await readExpireCertificate()
  res.json(successResponse(result, 'Sertifikasi kedaluwarsa'))
}

export const readExpireSafetyEmployee = async (req: Request, res: Response) => {
  const result = await readExpireSafety()
  res.json(successResponse(result, 'safety induction kadaluwarsa'))
}
