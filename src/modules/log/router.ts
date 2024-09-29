import { Router } from 'express'
import Controller from './controller'
import Validation from '../../helper/validation'
import { updateSchema } from './schema'

export default class TagRouter {
  public router: Router
  private schema: Validation = new Validation(updateSchema)
  private controller: Controller = new Controller()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.patch(
      '/:id',
      this.schema.validate,
      this.controller.updateHandler
    )
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
