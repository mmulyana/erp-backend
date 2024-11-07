import { Router } from 'express'
import Validation from '../../helper/validation'
import {
  addPermissionsToGroupSchema,
  createPermissionGroupSchema,
  createPermissionSchema,
  updatePermissionGroupSchema,
  updatePermissionSchema,
} from './schema'
import PermissionController from './controller'

export default class PermissionRouter {
  public router: Router
  private controller: PermissionController = new PermissionController()
  private createPermission: Validation = new Validation(createPermissionSchema)
  private updatePermission: Validation = new Validation(updatePermissionSchema)
  private createGroup: Validation = new Validation(createPermissionGroupSchema)
  private updateGroup: Validation = new Validation(updatePermissionGroupSchema)
  private addPermissionsToGroup: Validation = new Validation(
    addPermissionsToGroupSchema
  )

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    // Permission routes
    this.router.get('/', this.controller.readAllHandler)

    this.router.post(
      '/',
      this.createPermission.validate,
      this.controller.createHandler
    )

    this.router.patch(
      '/:id',
      this.updatePermission.validate,
      this.controller.updateHandler
    )

    this.router.delete('/:id', this.controller.deleteHandler)

    // Permission Group routes
    this.router.get('/group', this.controller.readAllGroupHandler)

    this.router.post(
      '/group',
      this.createGroup.validate,
      this.controller.createGroupHandler
    )

    this.router.patch(
      '/group/:id',
      this.updateGroup.validate,
      this.controller.updateGroupHandler
    )

    this.router.delete('/group/:id', this.controller.deleteGroupHandler)

    this.router.post(
      '/group/:id/permissions',
      this.addPermissionsToGroup.validate,
      this.controller.addPermissionsToGroupHandler
    )

    this.router.delete(
      '/group/:id/permissions',
      this.addPermissionsToGroup.validate,
      this.controller.removePermissionsFromGroupHandler
    )
  }
}
