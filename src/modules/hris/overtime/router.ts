import { Router } from 'express'
import Validation from '../../../helper/validation'
import { overtimeSchema } from './schema'
import OvertimeController from './controller'

export default class OvertimeRouter {
  public router: Router
  private overtimeSchema: Validation = new Validation(overtimeSchema)
  private controller: OvertimeController = new OvertimeController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.overtimeSchema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.overtimeSchema.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
