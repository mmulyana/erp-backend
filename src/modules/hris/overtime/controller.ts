import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import OvertimeRepository from './repository'
import { endOfDay } from 'date-fns'

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
  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, name, positionId } = req.query

      const data = await this.repository.read({
        startDate: date ? new Date(date as string) : endOfDay(new Date()),
        search: name ? String(name) : undefined,
        positionId: positionId ? Number(positionId) : undefined,
      })
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readPaginationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { date, fullname, positionId, page, limit } = req.query

      const data = await this.repository.readByPagination(
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined,
        {
          positionId: positionId ? Number(positionId) : undefined,
          fullname: fullname ? String(fullname) : undefined,
          startDate: date ? new Date(date as string) : endOfDay(new Date()),
        }
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readOneHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.readOne(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
