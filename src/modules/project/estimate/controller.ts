import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../helper/base-controller'
import EstimateRepository from './repository'

export default class EstimateController extends BaseController {
  private repository: EstimateRepository = new EstimateRepository()
  constructor() {
    super('Estimasi')
  }

  saveHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params
      const data = await this.repository.saveEstimate(
        Number(projectId),
        req.body
      )
      return this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }
  deleteHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.deleteMany(req.body)
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }
  readHandle = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params
      const data = await this.repository.read(Number(projectId))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
