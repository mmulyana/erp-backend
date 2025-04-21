import { Request, Response } from 'express'

import { successResponse } from '@/utils/response'
import { getParams } from '@/utils/params'

import {
  findExpiringSafetyInduction,
  findExpiringCertificates,
  findTotalEmployee,
  findEmployeePosition,
  findEmployeeEducation,
} from './repository'

export const getTotal = async (req: Request, res: Response) => {
  const result = await findTotalEmployee()
  res.json(successResponse(result, 'total'))
}

export const getExpiringCertificates = async (req: Request, res: Response) => {
  const { page, limit } = getParams(req)
  const day = req.query.day ? Number(req.query.day) : 30
  const result = await findExpiringCertificates({
    day,
    limit,
    page,
  })

  res.json(successResponse(result, 'sertifikat kadaluwarsa'))
}

export const getExpiringSafetyInduction = async (
  req: Request,
  res: Response,
) => {
  const { page, limit } = getParams(req)
  const day = req.query.day ? Number(req.query.day) : 30
  const result = await findExpiringSafetyInduction({
    day,
    limit,
    page,
  })

  res.json(successResponse(result, 'safety induction kadaluwarsa'))
}

export const getEmployeePosition = async (req: Request, res: Response) => {
  const result = await findEmployeePosition()
  res.json(successResponse(result, 'chart jabatan pegawai'))
}

export const getEmployeeEducation = async (req: Request, res: Response) => {
  const result = await findEmployeeEducation()
  res.json(successResponse(result, 'chart jabatan pegawai'))
}
