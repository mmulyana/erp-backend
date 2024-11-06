import { Router } from 'express'
import Validation from '../../helper/validation'
import { createRoleSchema, updateRoleSchema } from './schema'
import RoleController from './controller'

export default class RoleRouter {
  public router: Router
  private controller: RoleController = new RoleController()
  private create: Validation = new Validation(createRoleSchema)
  private update: Validation = new Validation(updateRoleSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.get('/', this.controller.getRolesHandler)
    this.router.get('/:id', this.controller.getRoleByIdHandler)
    this.router.post(
      '/',
      this.create.validate,
      this.controller.createRoleHandler
    )
    this.router.patch(
      '/:id',
      this.update.validate,
      this.controller.updateRoleHandler
    )
    this.router.get('/:id', this.controller.deleteRoleHandler)
    this.router.get(
      '/:id/permission/add/:permissionId',
      this.controller.addPermissionRoleHandler
    )
    this.router.get(
      '/:id/permission/remove/:permissionId',
      this.controller.deletePermissionRoleHandler
    )
  }
}
