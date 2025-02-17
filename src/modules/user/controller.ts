import { Request, Response } from 'express'
import { HttpStatusCode } from 'axios'

import {
  AddRoleSchema,
  CreateAccountSchema,
  UpdateAccountSchema,
} from './schema'
import {
  activateUserService,
  addPhotoUserService,
  addRoleUserService,
  createUserService,
  deleteUserService,
  removePhotoUserService,
  removeRoleUserService,
  unactivateUserService,
  updateUserService,
} from './service'
import { findAll, findRoleById, update } from './repository'

import {
  activateResponse,
  deleteResponse,
  successResponse,
  unactivateResponse,
  updateResponse,
} from '../../utils/response'
import { checkParamsId, getParams } from '../../utils/params'
import { errorParse, throwError } from '../../utils/error-handler'
import { Messages } from '../../utils/constant'

export const findUsers = async (req: Request, res: Response) => {
  const { page, limit, search } = getParams(req)
  const active = req.query.active ? req.query.active === 'true' : undefined
  const roleId = req.query.roleId ? String(req.query.roleId) : undefined
  if (roleId) {
    const role = await findRoleById(roleId)
    if (!role) {
      return throwError(
        `Role ini ${Messages.notFound}`,
        HttpStatusCode.NotFound,
      )
    }
  }

  const result = await findAll(page, limit, search, active, roleId)
  res.json(successResponse(result))
}

export const createUser = async (req: Request, res: Response) => {
  const parsed = CreateAccountSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await createUserService(parsed.data)
  res.json(successResponse(result, 'user'))
}

export const updateUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const parsed = UpdateAccountSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateUserService(id, parsed.data)
  res.json(updateResponse(result, 'user'))
}

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  await deleteUserService(id)
  res.json(deleteResponse('user'))
}

export const activateUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  await activateUserService(id)
  res.json(activateResponse('user'))
}

export const unactivateUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  await unactivateUserService(id)
  res.json(unactivateResponse('user'))
}

export const addRoleUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const parsed = AddRoleSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await addRoleUserService(id, parsed.data.roleId)
  res.json(updateResponse(result, 'user'))
}

export const removeRoleUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const result = await removeRoleUserService(id)
  res.json(updateResponse(result, 'user'))
}

export const addPhotoUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  const file = req.file
  if (!file) {
    return throwError(Messages.fileNotSended, HttpStatusCode.BadRequest)
  }

  const result = await addPhotoUserService(id, file.filename)
  res.json(updateResponse(result, 'user'))
}

export const removePhotoUser = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const result = await removePhotoUserService(id)
  res.json(updateResponse(result, 'user'))
}
