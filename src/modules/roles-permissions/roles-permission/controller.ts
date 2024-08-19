import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import RolePermissionRepository from './repository'

export default class RolesPermissionController {
  private response: ApiResponse = new ApiResponse()
  private repository: RolePermissionRepository = new RolePermissionRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rolesId, permissionId, enabled } = req.body
      const payload = {
        rolesId,
        permissionId,
        enabled: enabled || false,
      }
      await this.repository.create(payload)

      return this.response.success(res, 'success create role permission')
    } catch (error) {
      next(error)
    }
  }

  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { rolesId, permissionId, enabled } = req.body
      const payload = {
        rolesId,
        permissionId,
        enabled: enabled || false,
      }
      await this.repository.update(payload, Number(id))
      this.response.success(res, 'success update role permission')
    } catch (error) {
      next(error)
    }
  }

  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, 'success delete role permission')
    } catch (error) {
      next(error)
    }
  }

  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = this.repository.read(Number(id))
      return this.response.success(res, 'success get role permission', data)
    } catch (error: any) {
      if (error.message === 'role permission not found') {
        error.code = 404
      }
      next(error)
    }
  }

  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readAll()
      this.response.success(res, 'success get role permission', data)
    } catch (error) {
      next(error)
    }
  }
}
