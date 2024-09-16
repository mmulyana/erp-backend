import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { clientSchema } from './schema'

export default class ClientRouter {
  public router: Router
  private controller: ClientController = new ClientController()
  private clientSchema: Validation = new Validation(clientSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.clientSchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.clientSchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
  }
}
