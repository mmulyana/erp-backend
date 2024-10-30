import Validation from '../../../helper/validation'
import { Router } from 'express'
import EstimateController from './controller'
import { estimateSchema } from './schema'

export default class AttachmentRouter {
  public router: Router
  private createSchema: Validation = new Validation(estimateSchema)
  private controller: EstimateController = new EstimateController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post(
      '/:projectId',
      this.createSchema.validate,
      this.controller.saveHandle
    )
    this.router.delete('/', this.controller.deleteHandle)
    this.router.get('/:projectId', this.controller.readHandle)
  }
}
