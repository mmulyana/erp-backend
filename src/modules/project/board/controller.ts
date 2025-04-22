import { Request, Response } from 'express'

import { errorParse } from '@/utils/error-handler'
import { checkParamsId } from '@/utils/params'
import {
  createResponse,
  deleteResponse,
  updateResponse,
} from '@/utils/response'

import { create, destroy, read, update } from './repository'
import { BoardSchema } from './schema'

export const saveBoard = async (req: Request, res: Response) => {
  const parsed = BoardSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await create(parsed.data)
  res.json(createResponse(result, 'board'))
}

export const updateBoard = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  const parsed = BoardSchema.safeParse(req.body)
  if (!parsed.success) {
    return errorParse(parsed.error)
  }

  const result = await update(id, parsed.data)
  res.json(updateResponse(result, 'board'))
}

export const destroyBoard = async (req: Request, res: Response) => {
  const { id } = checkParamsId(req)

  await destroy(id)
  res.json(deleteResponse('board'))
}

export const readBoards = async (req: Request, res: Response) => {
  const result = await read()
  res.json(result)
}