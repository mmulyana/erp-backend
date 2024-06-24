import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../helper/api-response'
import { verify } from 'jsonwebtoken'
import dotenv from 'dotenv'
import { CustomRequest } from '../utils/types/common'
dotenv.config()

export class AuthMiddleware {
  private response: ApiResponse = new ApiResponse()

  isAuthenticated = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
      return this.response.error(res, 'Unauthorized', 401)
    }

    verify(token, process.env.SECRET as string, async (err, payload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return this.response.error(res, 'Token expired', 401)
        } else {
          return this.response.error(res, 'Token Invalid', 403)
        }
      }

      req.user = payload
      next()
    })
  }
}
