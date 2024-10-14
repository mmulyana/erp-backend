import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import OvertimeRepository from './repository'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import { convertDateString } from '../../../utils/convert-date'

export default class OvertimeController {
  private response: ApiResponse = new ApiResponse()
  private repository: OvertimeRepository = new OvertimeRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, MESSAGE_SUCCESS.OVERTIME.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.OVERTIME.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.OVERTIME.DELETE)
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
      return this.response.success(res, MESSAGE_SUCCESS.OVERTIME.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
