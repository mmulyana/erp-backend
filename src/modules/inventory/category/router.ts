import { Router } from 'express'
import Validation from '../../../helper/validation'
import { categorySchema } from './schema'
import CategoryController from './controller'

export default class CategoryRouter {
  public router: Router
  private schema: Validation = new Validation(categorySchema)
  private controller: CategoryController = new CategoryController()

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
