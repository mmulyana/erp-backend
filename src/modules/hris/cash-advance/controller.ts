import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import CashAdvanceRepository, { FilterCash } from './repository'

export default class CashAdvanceController extends BaseController {
  private repository: CashAdvanceRepository = new CashAdvanceRepository()

  constructor() {
    super('Kasbon')
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
      const data = await this.repository.update(Number(id), req.body)
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
      const data = await this.repository.readAll()
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readByIdHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.readById(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  ReadByPagination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, name, startDate, endDate } = req.query

      const data = await this.repository.readByPagination(
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined,
        {
          endDate: endDate ? new Date(String(endDate)) : undefined,
          startDate: startDate ? new Date(String(startDate)) : undefined,
          fullname: name ? String(name) : undefined,
        }
      )

      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readTotalHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.readTotal()
      return this.response.success(
        res,
        this.message.successReadField('jumlah kasbon'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  readTotalInYearHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { total } = req.query
      const data = await this.repository.readTotalInYear(
        total ? Number(total) : undefined
      )
      return this.response.success(
        res,
        this.message.successReadField('jumlah kasbon'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
