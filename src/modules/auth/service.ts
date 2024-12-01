import AuthRepository from './repository'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import TelegramService from '../../helper/telegram'
dotenv.config()

export interface LoginDTO {
  email?: string
  name?: string
  phoneNumber?: string
  password: string
}

export class AuthService {
  private repository: AuthRepository = new AuthRepository()
  private telegram: TelegramService = new TelegramService()

  async login(credentials: LoginDTO) {
    const { email, name, password, phoneNumber } = credentials

    let user
    if (email) {
      user = await this.repository.findByEmail(email)
    } else if (name) {
      user = await this.repository.findByName(name)
    } else if (phoneNumber) {
      user = await this.repository.findByPhone(phoneNumber)
    }

    if (!user?.active) {
      throw new Error('Akun tidak ada')
    }

    if (!user || !(await compare(password, user.password))) {
      throw new Error('Kredensial salah')
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.SECRET as string,
      { expiresIn: '2d' }
    )

    await this.telegram.send(`${user.name} sudah login`, 'log')

    return {
      name: user.name,
      token,
    }
  }
}
