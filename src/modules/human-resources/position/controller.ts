import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import PositionRepository from './repository'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'

export default class PositionController {
  private response: ApiResponse = new ApiResponse()
  private repository: PositionRepository = new PositionRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body
      this.repository.create({ name, description })
      this.response.success(res, MESSAGE_SUCCESS.POSITION.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body
      const { id } = req.params
      this.repository.update(Number(id), { name, description })
      this.response.success(res, MESSAGE_SUCCESS.POSITION.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      this.repository.delete(Number(id))
      this.response.success(res, MESSAGE_SUCCESS.POSITION.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      this.response.success(res, MESSAGE_SUCCESS.POSITION.READ, data)
    } catch (error) {
      next(error)
    }
  }
  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readAll()
      this.response.success(res, MESSAGE_SUCCESS.POSITION.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
