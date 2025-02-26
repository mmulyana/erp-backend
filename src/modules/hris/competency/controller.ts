import { Request, Response } from 'express'
import { CompetencySchema } from './schema'
import { errorParse } from '@/utils/error-handler'
import {
  create,
  destroy,
  findAll,
  findOne,
  isExist,
  update,
} from './repository'
import {
  createResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { checkParamsId, getParams } from '@/utils/params'

export const saveCompetency = async (req: Request, res: Response) => {
  const parsed = CompetencySchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create(parsed.data)
  res.json(createResponse(result, 'Kompetensi'))
}

export const updateCompetency = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = CompetencySchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'Kompetensi'))
}
export const destroyCompetency = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('Kompetensi'))
}
export const readCompetency = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'Kompetensi'))
}
export const readCompetencies = async (req: Request, res: Response) => {
  const { search } = getParams(req)

  const result = await findAll(search)
  res.json(successResponse(result, 'Kompetensi'))
}
