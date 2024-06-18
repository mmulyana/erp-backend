import { Router } from 'express'
import AccountController from './controller'

export default class AccountRouter {
  public router: Router
  private controller: AccountController = new AccountController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.get('/', this.controller.getAccounts)
    this.router.get('/:id', this.controller.getAccount)
    this.router.patch('/:id', this.controller.updateAccount)
    this.router.post('/', this.controller.createAccount)
    this.router.delete('/:id', this.controller.deleteAccount)
  }
}
