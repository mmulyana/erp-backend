import { checkParamsId, getParams } from '@/utils/params'
import { Request, Response } from 'express'

import {
  successResponse,
  createResponse,
  deleteResponse,
  updateResponse,
} from '@/utils/response'
import { errorParse } from '@/utils/error-handler'

import {
  findById,
  destroy,
  findAll,
  findOne,
  create,
  update,
} from './repository'
import { CreateRoleSchema, UpdateRoleSchema } from './schema'

export const findRoles = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)

  const result = await findAll(page, limit, search)
  res.json(successResponse(result, 'role'))
}

export const findRole = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await findById(id)

  const result = await findOne(id)
  res.json(successResponse(result, 'role'))
}

export const createRole = async (req: Request, res: Response) => {
  const parsed = CreateRoleSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create(parsed.data)
  res.json(createResponse(result, 'role'))
}

export const updateRole = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await findById(id)

  const parsed = UpdateRoleSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'role'))
}

export const deleteRole = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await findById(id)

  await destroy(id)
  res.json(deleteResponse('role'))
}
