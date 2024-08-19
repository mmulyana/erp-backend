import { Router } from 'express'
import RoleController from './controller'
import Validation from '../../../helper/validation'
import RolesSchema from './schema'

export default class RolesRoutes {
  public router: Router

  private controller: RoleController = new RoleController()

  private createSchema: Validation = new Validation(RolesSchema.create)
  private updateSchema: Validation = new Validation(RolesSchema.update)
  private addSchema: Validation = new Validation(RolesSchema.add)
  private changeSchema: Validation = new Validation(RolesSchema.change)
  private removeSchema: Validation = new Validation(RolesSchema.remove)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.get('/', this.controller.readRoles)
    this.router.get('/:id', this.controller.readRole)
    this.router.post('/', this.createSchema.validate, this.controller.createRole)
    this.router.patch('/:id', this.updateSchema.validate, this.controller.updateRole)
    this.router.delete('/:id', this.controller.deleteRole)

    this.router.post('/user/add', this.addSchema.validate, this.controller.add)
    this.router.post('/user/change', this.changeSchema.validate, this.controller.change)
    this.router.post('/user/remove', this.removeSchema.validate, this.controller.remove)
  }
}
