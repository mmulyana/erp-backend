import { Router } from 'express'
import PermissionGroupController from './controller'
import Validation from '../../helper/validation'
import permissionGroupSchema from './schema'

export default class PermissionGroupRoutes {
  public router: Router
  private controller: PermissionGroupController = new PermissionGroupController()
  private createSchema: Validation = new Validation(permissionGroupSchema.create)
  private updateSchema: Validation = new Validation(permissionGroupSchema.update)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
      this.router.patch('/:id', this.updateSchema.validate,this.controller.updateGroup)
      this.router.post('/', this.createSchema.validate, this.controller.createGroup)
      this.router.delete('/:id', this.controller.deleteGroup)
      this.router.get('/:id', this.controller.readGroup)
      this.router.get('/', this.controller.readGroups)
  }
}
