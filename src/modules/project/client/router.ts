import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { createSchema, updateSchema } from './schema'

export default class ClientRouter {
  public router: Router
  private controller: ClientController = new ClientController()
  private createSchema: Validation = new Validation(createSchema)
  private updateSchema: Validation = new Validation(updateSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.createSchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.updateSchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
    this.router.get('/:id', this.controller.handleReadOne)
  }
}
