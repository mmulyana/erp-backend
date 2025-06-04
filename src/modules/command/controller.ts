import { Request, Response } from 'express'
import { getQueryParam } from '@/utils'
import { search } from './repository'
import { successResponse } from '@/utils/response'

export const getSearch = async (req: Request, res: Response) => {
  const q = getQueryParam(req.query, 'q', 'string')
  const typesParams = getQueryParam(req.query, 'types', 'string')

  const types: string[] =
    typeof typesParams === 'string'
      ? typesParams.split(',').filter(Boolean)
      : Array.isArray(typesParams)
        ? typesParams
        : []

  const result = await search(q || '', types)
  res.json(successResponse(result, 'Pencarian'))
}
