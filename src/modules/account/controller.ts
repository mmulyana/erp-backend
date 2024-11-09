import { NextFunction, Request, Response } from 'express'
import BaseController from '../../helper/base-controller'
import AccountService from './service'

export default class AccountController extends BaseController {
  private service: AccountService = new AccountService()

  constructor() {
    super('Akun')
  }

  getAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.service.getAccount(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  getAllAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = req.query.page ? Number(req.query.page) : undefined
      const limit = req.query.limit ? Number(req.query.limit) : undefined
      const name = req.query.name ? String(req.query.name) : undefined
      const email = req.query.email ? String(req.query.email) : undefined
      const phoneNumber = req.query.phoneNumber
        ? String(req.query.phoneNumber)
        : undefined
      const roleId = req.query.roleId ? Number(req.query.roleId) : undefined

      const data = await this.service.getAllAccount(page, limit, {
        name,
        email,
        phoneNumber,
        roleId,
      })
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  updateAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.service.updateAccount(Number(id), {
        ...req.body,
        newPhoto: req.file?.filename,
      })
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      next(error)
    }
  }
  deleteAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.service.deleteAccount(Number(id))
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      next(error)
    }
  }
  createAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await this.service.createAccount({
        ...req.body,
        photo: req.file?.filename,
      })
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      next(error)
    }
  }
  updateRoleAccountHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, roleId } = req.params
      const data = await this.service.updateRoleAccount(
        Number(id),
        Number(roleId)
      )
      return this.response.success(
        res,
        this.message.successUpdateField('role'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  createPermissionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, permissionId } = req.query
      const data = await this.service.createPermissionAccount(
        Number(id),
        Number(permissionId)
      )
      return this.response.success(
        res,
        this.message.successCreateField('Hak istimewa'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  deletePermissionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, permissionId } = req.query
      const data = await this.service.deletePermissionAccount(
        Number(id),
        Number(permissionId)
      )
      return this.response.success(
        res,
        this.message.successDeleteField('Hak istimewa'),
        data
      )
    } catch (error) {
      next(error)
    }
  }

  updatePasswordHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.service.updatePassword(Number(id), req.body)
      return this.response.success(res, 'Password berhasil diperbarui')
    } catch (error) {
      next(error)
    }
  }
  resetPasswordHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { message } = req.body
      await this.service.resetPassword(Number(id), message ?? 'password')
      return this.response.success(res, 'Password berhasil direset')
    } catch (error) {
      next(error)
    }
  }
}
