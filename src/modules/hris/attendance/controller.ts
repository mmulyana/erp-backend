import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import BaseController from '../../../helper/base-controller'
import AttendanceRepository from './repository'
import { endOfDay } from 'date-fns'

export default class AttendanceController extends BaseController {
  private repository: AttendanceRepository = new AttendanceRepository()

  constructor() {
    super('Kehadiran')
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
      const { date, name, positionId, endDate } = req.query
      const localDate = endOfDay(new Date())

      const data = await this.repository.read({
        search: name ? String(name) : undefined,
        positionId: positionId ? Number(positionId) : undefined,
        startDate: date ? new Date(String(date)) : new Date(localDate),
        endDate: endDate ? new Date(String(endDate)) : undefined
      })
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
