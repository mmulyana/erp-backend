import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { labelSchema } from './schema'

export default class ClientRouter {
  public router: Router
  private controller: ClientController = new ClientController()
  private labelSchema: Validation = new Validation(labelSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.labelSchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.labelSchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
  }
}
