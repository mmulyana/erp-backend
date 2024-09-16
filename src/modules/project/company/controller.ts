import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import CompanyRepository from './repository'

export default class CompanyController {
  private response: ApiResponse = new ApiResponse()
  private repository: CompanyRepository = new CompanyRepository()

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, MESSAGE_SUCCESS.COMPANY.CREATE)
    } catch (error) {
      next(error)
    }
  }
  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.COMPANY.CREATE)
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.COMPANY.CREATE)
    } catch (error) {
      next(error)
    }
  }
  handleRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.read()
      return this.response.success(res, MESSAGE_SUCCESS.COMPANY.CREATE, data)
    } catch (error) {
      next(error)
    }
  }
}
