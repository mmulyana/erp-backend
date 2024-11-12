import AuthRepository from './repository'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export interface LoginDTO {
  email?: string
  name?: string
  phoneNumber?: string
  password: string
}

export class AuthService {
  private repository: AuthRepository = new AuthRepository()

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

    if (!user || !(await compare(password, user.password))) {
      throw new Error('Kredensial salah')
    }

    const token = jwt.sign(
      { id: user.id, name: user.name },
      process.env.SECRET as string,
      { expiresIn: '2d' }
    )

    return {
      name: user.name,
      token,
    }
  }
}
