import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import Message from '../../../utils/constant/message'
import LabelRepository from './repository'

export default class LabelController {
  private response: ApiResponse = new ApiResponse()
  private repository: LabelRepository = new LabelRepository()
  private message: Message = new Message('Label')

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate())
    } catch (error) {
      throw error
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      throw error
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error) {
      throw error
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query
      const data = await this.repository.read(name?.toString())
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      throw error
    }
  }
}
