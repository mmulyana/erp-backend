import { Router } from 'express'
import HelpdeskController from './controller'
import Validation from '../../helper/validation'
import { createSchema } from './schema'

export default class HelpdeskRouter {
  private controller: HelpdeskController = new HelpdeskController()
  private schema: Validation = new Validation(createSchema)
  public router: Router

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.schema.validate, this.controller.createHandler)
    this.router.get('/', this.controller.readHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
  }
}
