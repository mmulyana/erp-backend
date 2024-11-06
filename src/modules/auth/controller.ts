import BaseController from '../../helper/base-controller'
import { AuthService } from './service'
import dotenv from 'dotenv'
dotenv.config()

export default class AuthController extends BaseController {
  private service: AuthService = new AuthService()

  constructor() {
    super('auth')
  }

  login = async (req: any, res: any, next: any) => {
    try {
      const { name, email, phoneNumber, password } = req.body
      const data = await this.service.login({
        phoneNumber,
        password,
        email,
        name,
      })
      return this.response.success(res, `Selamat datang, ${name}`, data)
    } catch (error) {
      next(error)
    }
  }
}
