import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import RecapRepository from './repository'

export default class RecapController extends BaseController {
  private repository: RecapRepository = new RecapRepository()

  constructor() {
    super('Rekapan')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }

  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }

  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }

  readByPaginationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10, name, start_date, end_date } = req.query

      const filter: any = {}
      if (name) filter.name = String(name)
      if (start_date) filter.start_date = new Date(String(start_date))
      if (end_date) filter.end_date = new Date(String(end_date))

      const data = await this.repository.findByPagination(
        Number(page),
        Number(limit),
        Object.keys(filter).length > 0 ? filter : undefined
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.findAll()
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }

  readOneHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.findById(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
}
