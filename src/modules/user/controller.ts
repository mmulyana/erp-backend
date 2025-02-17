import { Request, Response } from 'express'

import { CreateAccountSchema } from './schema'
import { createUserService } from './service'
import { findAll } from './repository'

import { successResponse } from '../../utils/response'
import { errorParse } from '../../utils/error-handler'
import { getParams } from '../../utils/params'

export const findUsers = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const roleId = req.query.roleId ? String(req.query.roleId) : undefined

  const result = findAll(page, limit, search, active, roleId)
  res.json(successResponse(result))
}

export const createUser = async (req: Request, res: Response) => {
  const parsed = CreateAccountSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await createUserService(parsed.data)
  res.json(successResponse(result))
}
