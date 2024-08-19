import { Router } from 'express'
import UserRoleController from './controller'
import Validation from '../../../helper/validation'
import { userRoleSchema } from './schema'

export default class UserRoleRoutes {
  public router: Router
  private controller: UserRoleController = new UserRoleController()
  private createSchema: Validation = new Validation(userRoleSchema.create)
  private updateSchema: Validation = new Validation(userRoleSchema.update)
  private deleteSchema: Validation = new Validation(userRoleSchema.delete)

  constructor() {
    this.router = Router()
    this.register()
  }

  register() {
    this.router.post('/add', this.createSchema.validate, this.controller.addRoles)
    this.router.delete('/remove', this.deleteSchema.validate, this.controller.removeRoles)
  }
}
