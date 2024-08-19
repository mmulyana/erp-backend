import { Router } from 'express'
import { AuthSchema } from './schema'
import AuthController from './controller'
import Validation from '../../helper/validation'

export default class AuthRoutes {
  public router: Router

  private controller: AuthController = new AuthController()
  private loginSchema: Validation = new Validation(AuthSchema.login)
  private registerSchema: Validation = new Validation(AuthSchema.register)

  constructor() {
    this.router = Router()
    this.registerRoutes()
  }

  protected registerRoutes() {
    this.router.post('/login', this.loginSchema.validate, this.controller.login)
    this.router.post('/register', this.registerSchema.validate, this.controller.register)
    this.router.post('/check/email', this.controller.checkEmail)
    this.router.post('/check/name', this.controller.checkName)
  }
}
