import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../helper/base-controller'
import EstimateRepository from './repository'

export default class EstimateController extends BaseController {
  private repository: EstimateRepository = new EstimateRepository()
  constructor() {
    super('Estimasi')
  }

  createHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }
  updateHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }
  deleteHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }
  readHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
