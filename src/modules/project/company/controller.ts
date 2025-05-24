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

export const postCompany = async (req: Request, res: Response) => {
  const parsed = CompanySchema.safeParse(req.body)
  if (!parsed) {
    return errorParse(parsed.error)
  }

  const photoUrl = req?.file?.filename || undefined

  const result = await create({ ...parsed.data, photoUrl })
  res.json(createResponse(result, 'Perusahaan baru'))
}

export const patchCompany = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = CompanySchema.safeParse(req.body)
  if (!parsed) {
    return errorParse(parsed.error)
  }

  console.log('filename', req?.file?.filename)
  const photoUrl = req?.file?.filename || parsed.data.photoUrl || null

  const result = await update(id, { ...parsed.data, photoUrl })
  res.json(updateResponse(result, 'Perusahaan'))
}

export const deleteCompany = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('Perusahaan'))
}

export const getCompany = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)
  const result = await read(id)
  res.json(successResponse(result, 'Perusahaan'))
}

export const getCompanies = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const result = await readAll({ page, limit, search })
  res.json(successResponse(result, 'Perusahaan'))
}

export const getCompaniesInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const result = await readAll({ page, limit, search, infinite: true })
  res.json(successResponse(result, 'Perusahaan'))
}
