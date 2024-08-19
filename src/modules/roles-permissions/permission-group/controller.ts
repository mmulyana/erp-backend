import { NextFunction, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import { CustomRequest } from '../../../utils/types/common'
import PermissionGroupRepository from './repository'

export default class PermissionGroupController {
  private response: ApiResponse = new ApiResponse()
  private repository: PermissionGroupRepository =
    new PermissionGroupRepository()

  readGroups = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.readAll()
      return this.response.success(res, 'success get groups', data)
    } catch (error) {
      next(error)
    }
  }

  readGroup = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      return this.response.success(res, 'success get groups', data)
    } catch (error) {
      next(error)
    }
  }

  createGroup = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, description, permissionNames } = req.body
      const payload = {
        name,
        permissionNames: permissionNames || [],
        description: description || '',
      }
      await this.repository.create(payload)
      return this.response.success(res, 'success create group permission')
    } catch (error) {
      next(error)
    }
  }

  updateGroup = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name, description, permissionNames, newPermissionNames } =
        req.body
      const { id } = req.params
      const payload = {
        name,
        permissionNames: permissionNames || [],
        description: description || '',
        newPermissionNames: newPermissionNames || [],
      }
      await this.repository.update(payload, Number(id))
      return this.response.success(res, 'success update group')
    } catch (error) {
      next(error)
    }
  }

  deleteGroup = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, 'success delete group')
    } catch (error) {
      next(error)
    }
  }
}
