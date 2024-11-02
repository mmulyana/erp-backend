import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import Repository from './repository'

export default class TransactionController extends BaseController {
  private repository: Repository = new Repository()
  
  constructor() {
    super('Transaksi')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
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

  readBorrowedGoodsHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readGoodsBorrowed()
      return this.response.success(res, this.message.successReadField('dipinjam'), data)
    } catch(error) {
      next(error)
    }
  }
}
