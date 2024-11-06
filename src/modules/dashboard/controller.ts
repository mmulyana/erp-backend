import { NextFunction, Request, Response } from 'express'
import BaseController from '../../helper/base-controller'
import DashboardRepository from './repository'

export default class DashboardController extends BaseController {
  private repository: DashboardRepository = new DashboardRepository()

  constructor() {
    super('dashboard')
  }

  handleTotal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readTotal()
      return this.response.success(
        res,
        this.message.successReadField('total'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
