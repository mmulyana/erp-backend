import { Router } from 'express'
import { AccountSchema } from './schema'
import AccountController from './controller'
import Validation from '../../helper/validation'

export default class AccountRouter {
  public router: Router
  private controller: AccountController = new AccountController()
  private createValidation: Validation = new Validation(AccountSchema.create)
  private updateValidation: Validation = new Validation(AccountSchema.update)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.get('/', this.controller.getAccounts)
    this.router.get('/:id', this.controller.getAccount)
    this.router.delete('/:id', this.controller.deleteAccount)
    this.router.post('/', this.createValidation.validate, this.controller.createAccount)
    this.router.patch('/:id', this.updateValidation.validate, this.controller.updateAccount)
  }
}
