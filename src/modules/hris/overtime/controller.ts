import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import OvertimeRepository from './repository'
import { convertDateString } from '../../../utils/convert-date'
import BaseController from '../../../helper/base-controller'

export default class OvertimeController extends BaseController {
  private repository: OvertimeRepository = new OvertimeRepository()

  constructor() {
    super('Overtime')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate())
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
      const { date, name } = req.query
      const searchName = name ? String(name) : undefined
      let startDate = new Date().toISOString()
      if (date) {
        startDate = convertDateString(date as string)
      }

      const data = await this.repository.read(startDate, {
        search: searchName,
      })
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
