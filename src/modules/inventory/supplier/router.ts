import { Router } from 'express'
import Validation from '../../../helper/validation'
import Controller from './controller'
import { supplierSchema, updateTagSchema } from './schema'

export default class SupplierRouter {
  public router: Router
  private schema: Validation = new Validation(supplierSchema)
  private updateTagSchema: Validation = new Validation(updateTagSchema)
  private controller: Controller = new Controller()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.schema.validate, this.controller.createHandler)
    this.router.patch(
      '/:id',
      this.schema.validate,
      this.controller.updateHandler
    )
    this.router.patch(
      '/:id',
      this.updateTagSchema.validate,
      this.controller.updateTagsHandler
    )
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
