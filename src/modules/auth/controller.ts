import prisma from '../../../lib/prisma'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import ApiResponse from '../../helper/api-response'
import { compare, genSalt, hash } from 'bcryptjs'
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

      const user = await prisma.user.findFirst(query)

      if (!(user && (await compare(password, user.password)))) {
        throw new Error('Invalid name or email and password')
      }

      const token = jwt.sign(
        { name: user?.name, email: user?.password },
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

      return this.responseHandler.success(res, 'login successfully', payload)
    } catch (error: any) {
      error.code = 400
      next(error)
    }
  }

  register = async (req: any, res: any, next: any) => {
    try {
      const { name, email, password } = req.body

      const existingUser = await prisma.user.findFirst({
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

      await prisma.user.create(payload)

      this.responseHandler.success(res, 'successfully registered')
    } catch (error: any) {
      error.code = 400
      next(error)
    }
  }

  checkName = async (req: any, res: any, next: any) => {
    try {
      const { name } = req.body
      const existingUser = await prisma.user.findUnique({
        where: {
          name,
        },
      })
      if (!existingUser) {
        this.responseHandler.success(res, 'success get user by name', {})
      }

      this.responseHandler.success(res, 'success get user by namme', {
        name: existingUser?.name,
      })
    } catch (error: any) {
      error.code = 401
      next(error)
    }
  }

  checkEmail = async (req: any, res: any, next: any) => {
    try {
      const { email } = req.body
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (!existingUser) {
        this.responseHandler.success(res, 'success get user by email', {})
      }

      this.responseHandler.success(res, 'success get user by email', {
        email: existingUser?.email,
      })
    } catch (error: any) {
      error.code = 401
      next(error)
    }
  }
}
