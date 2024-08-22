import { NextFunction, Request, Response } from 'express'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import ApiResponse from '../../../helper/api-response'
import LeaveRepository from './repository'

export default class LeaveController {
  private response: ApiResponse = new ApiResponse()
  private repository: LeaveRepository = new LeaveRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      this.response.success(res, MESSAGE_SUCCESS.LEAVE.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      this.response.success(res, MESSAGE_SUCCESS.LEAVE.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      this.response.success(res, MESSAGE_SUCCESS.LEAVE.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.query
      const data = await this.repository.read(Number(id))
      this.response.success(res, MESSAGE_SUCCESS.LEAVE.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
