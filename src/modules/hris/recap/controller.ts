import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import RecapRepository from './repository'
import { generateReport } from '../../../utils/generate-report'

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
      const { page = 1, limit = 10, name, year } = req.query

      const data = await this.repository.findByPagination(
        Number(page),
        Number(limit),
        {
          name: name ? String(name) : undefined,
          year: year ? Number(year) : undefined,
        }
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
  readReportHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query
      const { id } = req.params
      const recap = await this.repository.findById(Number(id))

      if (!recap) {
        throw Error('data tidak ditemukan')
      }

      if (!recap.start_date || !recap.end_date) {
        throw Error('tanggal mulai dan akhir tidak boleh kosong')
      }

      const startDate = new Date(recap.start_date)
      const endDate = new Date(recap.end_date)

      const data = await this.repository.getReport(
        startDate,
        endDate,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined
      )

      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  exportHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = req.query
      const { id } = req.params
      const recap = await this.repository.findById(Number(id))

      if (!recap) {
        throw Error('data tidak ditemukan')
      }

      if (!recap.start_date || !recap.end_date) {
        throw Error('tanggal mulai dan akhir tidak boleh kosong')
      }

      const startDate = new Date(recap.start_date)
      const endDate = new Date(recap.end_date)

      const data = await this.repository.getReport(
        startDate,
        endDate,
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined
      )
      await generateReport({ data: data.data, dates: data.dates }, res)
    } catch (error) {
      next(error)
    }
  }
}
