import { Router } from 'express'
import { leaveSchema } from './schema'
import Validation from '../../../helper/validation'

export default class LeaveRouter {
  public router: Router
  private leaveSchema: Validation = new Validation(leaveSchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/')
    this.router.patch('/:id')
    this.router.delete('/:id')
    this.router.get('/')
  }
}
