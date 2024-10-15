import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { commentSchema } from './schema'

export default class ClientRouter {
  public router: Router
  private controller: ClientController = new ClientController()
  private commentSchema: Validation = new Validation(commentSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.commentSchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.commentSchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
  }
}
