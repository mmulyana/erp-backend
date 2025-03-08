import { Request, Response } from 'express'
import { CompanySchema } from './schema'
import { errorParse } from '@/utils/error-handler'
import { checkParamsId, getParams } from '@/utils/params'
import { create, destroy, isExist, read, readAll, update } from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'

export const saveCompany = async (req: Request, res: Response) => {
  const parsed = CompanySchema.safeParse(req.body)
  if (!parsed) {
    return errorParse(parsed.error)
  }

  const result = await create(parsed.data)
  res.json(createResponse(result, 'Perusahaan baru'))
}
export const updateCompany = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = CompanySchema.safeParse(req.body)
  if (!parsed) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'Perusahaan'))
}
export const destroyCompany = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('Perusahaan'))
}
export const readCompany = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)
  const result = await read(id)
  res.json(successResponse(result, 'Perusahaan'))
}

export const readCompanies = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const result = await readAll({ page, limit, search })
  res.json(successResponse(result, 'Perusahaan'))
}
