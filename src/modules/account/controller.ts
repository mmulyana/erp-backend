import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../helper/api-response'
import AccountRepository from './repository'
import { PayloadUser } from '../../utils/types/common'

export default class AccountController {
  private response: ApiResponse = new ApiResponse()
  private repository: AccountRepository = new AccountRepository()

  getAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      this.response.success(res, 'success get account', data)
    } catch (error) {
      next(error)
    }
  }

  getAccounts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readAll()
      this.response.success(res, 'success get accounts', data)
    } catch (error) {
      next(error)
    }
  }

  updateAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { name, email, password, rolesId } = req.body
      const data = await this.repository.update(Number(id), {
        email,
        name,
        rolesId,
        ...(password ? password : undefined),
      })
      return this.response.success(res, 'success update account', data)
    } catch (error) {
      next(error)
    }
  }

  createAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, password, rolesId } = req.body
      const payload: PayloadUser = {
        email,
        name,
        rolesId,
      }
      if (!!password) {
        payload.password = password
      }
      await this.repository.create(payload)

      return this.response.success(res, 'success create account')
    } catch (error) {
      next(error)
    }
  }

  deleteAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      this.repository.delete(Number(id))
      return this.response.success(res, 'success delete account')
    } catch (error) {
      next(error)
    }
  }
}
