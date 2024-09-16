import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { companySchema } from './schema'

export default class CompanyRouter {
  public router: Router
  private controller: ClientController = new ClientController()
  private companySchema: Validation = new Validation(companySchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.companySchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.companySchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
  }
}
