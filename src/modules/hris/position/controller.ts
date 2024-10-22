import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../helper/base-controller'
import PositionRepository from './repository'

export default class PositionController extends BaseController {
  private repository: PositionRepository = new PositionRepository()

  constructor() {
    super('jabatan')
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
    } catch (error: any) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error: any) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error: any) {
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
  readTotalByPositionHandler = async (
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.totalEmployeePerPosition()
      return this.response.success(
        res,
        this.message.successReadCustom('pegawai per jabatan'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  readTotalByStatusnHandler = async (
    _: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.totalEmployeePerStatus()
      return this.response.success(
        res,
        this.message.successReadCustom('pegawai per status'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
