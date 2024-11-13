import { NextFunction, Request, Response } from 'express'
import BaseController from '../../helper/base-controller'
import RoleService from './service'

export default class RoleController extends BaseController {
  private service: RoleService = new RoleService()

  constructor() {
    super('role')
  }

  getRolesHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getRoles()
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  getRoleByIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.service.getRoleBydId(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  createRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.createRole(req.body)
      return this.response.success(res, this.message.successCreate())
    } catch (error) {
      next(error)
    }
  }
  updateRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.service.updateRole(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
  deleteRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.service.deleteRole(Number(id))
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }
  addPermissionRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, permissionId } = req.params
      const data = await this.service.addPermissionRole(
        Number(id),
        Number(permissionId)
      )
      return this.response.success(
        res,
        this.message.successCreateField('hak istimewa'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  deletePermissionRoleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, permissionId } = req.params
      const data = await this.service.removePermissionRole(
        Number(id),
        Number(permissionId)
      )
      return this.response.success(
        res,
        this.message.successDeleteField('hak istimewa'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
