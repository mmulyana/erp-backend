import { Router } from 'express'
import Validation from '../../../helper/validation'
import { overtimeSchema } from './schema'
import OvertimeController from './controller'

export default class OvertimeRouter {
  public router: Router
  private create: Validation = new Validation(overtimeSchema)
  private update: Validation = new Validation(overtimeSchema.partial())
  private controller: OvertimeController = new OvertimeController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.create.validate, this.controller.createHandler)
    this.router.patch('/:id', this.update.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)

    this.router.get('/list/pagination', this.controller.readPaginationHandler)
    this.router.get('/:id', this.controller.readOneHandler)
    this.router.get('/', this.controller.readAllHandler)
  }
}
