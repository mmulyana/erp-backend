import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../helper/base-controller'
import Repository from './repository'

export default class ActivityController extends BaseController {
  private repository: Repository = new Repository()

  constructor() {
    super('Aktivitas')
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate())
    } catch (error) {
      next(error)
    }
  }
  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error) {
      next(error)
    }
  }
  handleRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.read()
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
