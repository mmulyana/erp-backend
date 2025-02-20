import { Request, Response } from 'express'
import { PositionSchema } from './schema'
import { errorParse } from '@/utils/error-handler'
import {
  create,
  destroy,
  isExist,
  read,
  readAll,
  totalEmployeePerPosition,
  totalEmployeePerStatus,
  update,
} from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'

export const savePosition = async (req: Request, res: Response) => {
  const parsed = PositionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create(parsed.data)
  res.json(createResponse(result, 'jabatan'))
}
export const updatePosition = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = PositionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'jabatan'))
}
export const getPosition = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await read(id)
  res.json(successResponse(result, 'jabatan'))
}

export const getPositions = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const result = await readAll(page, limit, search)
  res.json(successResponse(result, 'jabatan'))
}

export const destroyPosition = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('jabatan'))
}
export const getTotalByPosition = async (req: Request, res: Response) => {
  const result = await totalEmployeePerPosition()
  res.json(successResponse(result, 'pegawai per jabatan'))
}

export const getTotalByStatus = async (req: Request, res: Response) => {
  const result = await totalEmployeePerStatus()
  res.json(successResponse(result, 'pegawai per status'))
}
