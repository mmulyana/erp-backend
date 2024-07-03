import { Router } from 'express'
import RolesPermissionController from './controller'
import Validation from '../../helper/validation'
import rolePermissionSchema from './schema'

export default class RolesPermissionRoutes {
  public router: Router

  private controller: RolesPermissionController =
    new RolesPermissionController()
  private createSchema: Validation = new Validation(rolePermissionSchema.create)
  private updateSchema: Validation = new Validation(rolePermissionSchema.update)

  constructor() {
    this.router = Router()
    this.register()
  }

  register() {
    this.router.get('/:id', this.controller.readHandler)
    this.router.get('/', this.controller.readAllHandler)
    this.router.post('/', this.createSchema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.updateSchema.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
  }
}
