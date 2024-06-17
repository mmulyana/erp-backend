import { Router } from 'express'
import Validation from '../../helper/validation'
import permissionSchema from './schema'
import PermissionController from './controller'

export default class PermissionRoutes {
  public router: Router
  private controller: PermissionController = new PermissionController()
  private createSchema: Validation = new Validation(permissionSchema.create)
  private updateSchema: Validation = new Validation(permissionSchema.update)
  
  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.createSchema.validate, this.controller.create)
    this.router.patch('/:id', this.updateSchema.validate, this.controller.update)
    this.router.delete('/:id', this.controller.delete)
    this.router.get('/', this.controller.read)
  }
}
