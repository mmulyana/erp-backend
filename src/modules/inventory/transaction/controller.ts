import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import Repository from './repository'
import Message from '../../../utils/constant/message'

export default class TransactionController {
  private response: ApiResponse = new ApiResponse()
  private repository: Repository = new Repository()
  private message: Message = new Message('Transaksi')

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create({
        ...req.body,
        photoUrl: req.file?.filename,
      })
      return this.response.success(res, this.message.successCreate())
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), {
        ...req.body,
        photoUrl: req.file?.filename,
      })
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query
      const data = await this.repository.read(type?.toString())
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
