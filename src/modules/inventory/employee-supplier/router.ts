import { Router } from 'express'
import Validation from '../../../helper/validation'
import { schema, updateSchema } from './schema'
import Controller from './controller'

export default class EmployeeSupplierRouter {
  public router: Router
  private schema: Validation = new Validation(schema)
  private updateSchema: Validation = new Validation(updateSchema)
  private controller: Controller = new Controller()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.schema.validate, this.controller.createHandler)
    this.router.patch(
      '/:id',
      this.updateSchema.validate,
      this.controller.updateHandler
    )
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
