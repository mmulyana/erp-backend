import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import ApiResponse from '../../helper/api-response'
import { compare, genSalt, hash } from 'bcryptjs'
import db from '../../lib/db'
dotenv.config()

export default class AuthController {
  private responseHandler: ApiResponse = new ApiResponse()

  login = async (req: any, res: any, next: any) => {
    try {
      const { email, password, name } = req.body

      let query: { where: { email?: string; name?: string } } = { where: {} }

      if (!!name) {
        query = {
          where: {
            name,
          },
        }
      }

      if (!!email) {
        query = {
          where: {
            email,
          },
        }
      }

      const user = await db.user.findFirst(query)

      if (!(user && (await compare(password, user.password)))) {
        throw new Error('Invalid name or email and password')
      }

      const token = jwt.sign(
        { id: user?.id, name: user?.name, email: user?.email },
        process.env.SECRET || '',
        {
          expiresIn: '2d',
        }
      )

      const payload = {
        name: user?.name,
        email: user?.email,
        token,
      }

      return this.responseHandler.success(res, 'Berhasil login', payload)
    } catch (error: any) {
      error.code = 400
      next(error)
    }
  }

  register = async (req: any, res: any, next: any) => {
    try {
      const { name, email, password } = req.body

      const existingUser = await db.user.findFirst({
        where: {
          OR: [
            {
              name,
            },
            {
              email,
            },
          ],
        },
      })
      if (existingUser) {
        throw new Error('user already registered')
      }

      const salt = await genSalt()
      const hashPassword = await hash(password, salt)

      const payload = {
        data: {
          name,
          email,
          password: hashPassword,
        },
      }

      await db.user.create(payload)

      this.responseHandler.success(res, 'berhasil daftar')
    } catch (error: any) {
      error.code = 400
      next(error)
    }
  }

  checkName = async (req: any, res: any, next: any) => {
    try {
      const { name } = req.body
      const existingUser = await db.user.findUnique({
        where: {
          name,
        },
      })
      if (!existingUser) {
        this.responseHandler.success(res, 'success get user by name', {
          isAvailable: true,
        })
      }

      this.responseHandler.success(res, 'success get user by namme', {
        isAvailable: false,
      })
    } catch (error: any) {
      error.code = 401
      next(error)
    }
  }

  checkEmail = async (req: any, res: any, next: any) => {
    try {
      const { email } = req.body
      const existingUser = await db.user.findUnique({
        where: {
          email,
        },
      })
      if (!existingUser) {
        this.responseHandler.success(res, 'success get user by email', {
          isAvailable: true,
        })
      }

      this.responseHandler.success(res, 'success get user by email', {
        isAvailable: false,
      })
    } catch (error: any) {
      error.code = 401
      next(error)
    }
  }
}
