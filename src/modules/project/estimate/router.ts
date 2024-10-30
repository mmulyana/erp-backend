import Validation from '../../../helper/validation'
import { Router } from 'express'
import EstimateController from './controller'
import { estimateSchema, updateEstimate } from './schema'

export default class AttachmentRouter {
  public router: Router
  private createSchema: Validation = new Validation(estimateSchema)
  private updateSchema: Validation = new Validation(updateEstimate)
  private controller: EstimateController = new EstimateController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post(
      '/',
      this.createSchema.validate,
      this.controller.createHandle
    )
    this.router.patch(
      '/:id',
      this.updateSchema.validate,
      this.controller.updateHandle
    )
    this.router.delete('/:id', this.controller.deleteHandle)
    this.router.get('/:id', this.controller.readHandle)
  }
}
