import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import CompetencyRepository from './repository'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'

export default class CompetencyController {
  private response: ApiResponse = new ApiResponse()
  private repository: CompetencyRepository = new CompetencyRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, MESSAGE_SUCCESS.COMPETENCY.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.COMPETENCY.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.COMPETENCY.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query
      const data = await this.repository.read(name?.toString())
      return this.response.success(res, MESSAGE_SUCCESS.COMPETENCY.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
