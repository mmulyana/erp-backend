import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { boardSchema } from './schema'

export default class CompanyRouter {
  public router: Router
  private controller: ClientController = new ClientController()
  private boardSchema: Validation = new Validation(boardSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post(
      '/',
      this.boardSchema.validate,
      this.controller.handleCreate
    )
    this.router.patch(
      '/:id',
      this.boardSchema.validate,
      this.controller.handleUpdate
    )
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
    
    this.router.get('/data/chart', this.controller.handleBoardChart)
  }
}
