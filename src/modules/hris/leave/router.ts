import { Router } from 'express'
import { leaveSchema } from './schema'
import Validation from '../../../helper/validation'
import LeaveController from './controller'

export default class LeaveRouter {
  public router: Router
  private leaveSchema: Validation = new Validation(leaveSchema)
  private controller: LeaveController = new LeaveController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.patch('/:id', this.leaveSchema.validate, this.controller.updateHandler)
    this.router.post('/', this.leaveSchema.validate, this.controller.createHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
