import { Request, Response } from 'express'
import { hash } from 'bcryptjs'

import { checkParamsId, getParams } from '@/utils/params'
import { errorParse } from '@/utils/error-handler'
import {
  createResponse,
  customResponse,
  deleteResponse,
  successResponse,
  updateResponse,
} from '@/utils/response'
import { create, destroy, find, findAll, isExist, update } from './repository'
import { AccountSchema } from './schema'

export const getUsers = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const roleId = req.query.roleId ? String(req.query.roleId) : undefined

  const result = await findAll({ page, limit, search, active, roleId })
  res.json(successResponse(result, 'users'))
}

export const getUsersInfinite = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const roleId = req.query.roleId ? String(req.query.roleId) : undefined

  const result = await findAll({
    page,
    limit,
    search,
    active,
    roleId,
    infinite: true,
  })
  res.json(successResponse(result, 'users'))
}

export const postUser = async (req: Request, res: Response) => {
  const parsed = AccountSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const password = await hash(process.env.DEFAULT_PASSWORD as string, 10)
  const result = await create({ ...parsed.data, password })
  res.json(successResponse(result, 'user'))
}

export const patchUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const parsed = AccountSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }
  const password = parsed.data.password
    ? await hash(parsed.data.password, 10)
    : undefined
  const result = await update(id, { ...parsed.data, password })
  res.json(updateResponse(result, 'user'))
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  await destroy(id)
  res.json(deleteResponse('user'))
}

export const getUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await isExist(id)

  const result = await find(id)
  res.json(successResponse(result, 'user'))
}

export const patchResetPassword = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  const password = await hash(process.env.DEFAULT_PASSWORD as string, 10)
  await update(id, {
    password,
  })
  res.json(updateResponse('password user'))
}
