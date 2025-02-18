import { Request, Response } from 'express'
import { HttpStatusCode } from 'axios'
import {
  updatePermissionRepository,
  updateGroupRepository,
  findPermissionById,
  destroyPermission,
  createPermission,
  findPermissions,
  findGroupById,
  destroyGroup,
  createGroup,
  findAll,
} from './repository'
import {
  successResponse,
  createResponse,
  deleteResponse,
  updateResponse,
} from '@/utils/response'
import {
  CreatePermissionSchema,
  UpdatePermissionSchema,
  CreateGroupSchema,
} from './schema'
import { errorParse, throwError } from '@/utils/error-handler'
import { checkParamsId, getParams } from '@/utils/params'
import { isValidUUID } from '@/utils/is-valid-uuid'
import { Messages } from '@/utils/constant'

export const getAllByGroup = async (req: Request, res: Response) => {
  const { search } = getParams(req)

  const result = await findAll(search)
  res.json(successResponse(result, 'permission'))
}

export const getAllPermission = async (req: Request, res: Response) => {
  const { search } = getParams(req)
  const groupId = req.query.groupId ? Number(req.query.groupId) : undefined

  const result = await findPermissions(search, groupId)
  res.json(successResponse(result, 'permission'))
}

export const savePermission = async (req: Request, res: Response) => {
  const parsed = CreatePermissionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await createPermission(parsed.data)
  res.json(createResponse(result, 'permission'))
}

export const saveGroup = async (req: Request, res: Response) => {
  const parsed = CreateGroupSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await createGroup(parsed.data)
  res.json(createResponse(result, 'group'))
}

export const updatePermission = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  if (!isValidUUID(id)) {
    return throwError(Messages.BadRequest, HttpStatusCode.BadRequest)
  }

  await findPermissionById(id)

  const parsed = UpdatePermissionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updatePermissionRepository(id, parsed.data)
  res.json(updateResponse(result, 'permission'))
}

export const updateGroup = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  await findPermissionById(id)

  const parsed = UpdatePermissionSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await updateGroupRepository(Number(id), parsed.data)
  res.json(updateResponse(result, 'permission'))
}

export const deletePermission = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  if (!isValidUUID(id)) {
    return throwError(Messages.BadRequest, HttpStatusCode.BadRequest)
  }

  await findPermissionById(id)

  await destroyPermission(id)
  res.json(deleteResponse('permission'))
}

export const deleteGroup = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)
  await findGroupById(Number(id))

  await destroyGroup(Number(id))
  res.json(deleteResponse('group'))
}
