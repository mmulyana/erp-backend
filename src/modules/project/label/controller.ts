import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import LabelRepository from './repository'

export default class LabelController {
  private response: ApiResponse = new ApiResponse()
  private repository: LabelRepository = new LabelRepository()

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, MESSAGE_SUCCESS.LABEL.CREATE)
    } catch (error) {
      next(error)
    }
  }
  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.LABEL.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.LABEL.DELETE)
    } catch (error) {
      next(error)
    }
  }
  handleRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.read()
      return this.response.success(res, MESSAGE_SUCCESS.LABEL.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
