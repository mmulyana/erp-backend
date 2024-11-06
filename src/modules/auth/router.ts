import Validation from '../../helper/validation'
import AuthController from './controller'
import { loginSchema } from './schema'
import { Router } from 'express'

export default class AuthRoutes {
  public router: Router

  private controller: AuthController = new AuthController()
  private loginSchema: Validation = new Validation(loginSchema)

  constructor() {
    this.router = Router()
    this.registerRoutes()
  }

  protected registerRoutes() {
    this.router.post('/login', this.loginSchema.validate, this.controller.login)
  }
}
