import { permissions as DefaultPermission } from '@/utils/constant/permissions'
import { successResponse, updateResponse } from '@/utils/response'
import { Request, Response } from 'express'

let data = DefaultPermission
export const getPermissions = (req: Request, res: Response) => {
  res.json(successResponse(data, 'Hak akses'))
}

export const updatePermissions = (req: Request, res: Response) => {
  const { permissions } = req.body
  data = permissions
  res.json(updateResponse(null, 'Hak akses'))
}
