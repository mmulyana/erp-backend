import { Router } from 'express'
import Validation from '../../../helper/validation'
import LocationController from './controller'
import { locationSchema } from './schema'

export default class LocationRouter {
  public router: Router
  private schema: Validation = new Validation(locationSchema)
  private controller: LocationController = new LocationController()

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
