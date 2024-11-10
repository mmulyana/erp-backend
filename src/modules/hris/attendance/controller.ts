import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import AttendanceRepository from './repository'
import { convertDateString } from '../../../utils/convert-date'
import BaseController from '../../../helper/base-controller'

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
      const { date, name, positionId } = req.query

      const data = await this.repository.read(
        date ? new Date(date as string) : new Date(),
        {
          search: name ? String(name) : undefined,
          positionId: positionId ? Number(positionId) : undefined
        }
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
