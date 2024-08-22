import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import AttendanceRepository from './repository'

export default class AttendanceController {
  private response: ApiResponse = new ApiResponse()
  private repository: AttendanceRepository = new AttendanceRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, MESSAGE_SUCCESS.ATTENDANCE.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.ATTENDANCE.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.ATTENDANCE.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query
      const data = await this.repository.read(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.ATTENDANCE.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
