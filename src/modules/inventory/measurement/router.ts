import { Router } from 'express'
import Validation from '../../../helper/validation'
import { locationSchema } from '../location/schema'
import Controller from './controller'

export default class MeasurementRouter {
  public router: Router
  private schema: Validation = new Validation(locationSchema)
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
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
