import { Router } from 'express'
import Validation from '../../../helper/validation'
import LabelController from './controller'
import { labelSchema } from './schema'

export default class LabelRouter {
  public router: Router
  private schema: Validation = new Validation(labelSchema)
  private controller: LabelController = new LabelController()

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
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
