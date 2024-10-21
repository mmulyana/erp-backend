import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import BrandRepository from './repository'
import Message from '../../../utils/constant/message'
import BaseController from '../../../helper/base-controller'

export default class BrandController extends BaseController {
  private repository: BrandRepository = new BrandRepository()

  constructor() {
    super('Merek')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create({
        name: req.body.name,
        photoUrl: req.file?.filename,
      })
      return this.response.success(res, this.message.successCreate())
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), {
        ...(req.body.name !== '' ? { name: req.body.name } : undefined),
        photoUrl: req.file?.filename,
      })
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
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query
      const data = await this.repository.read(name?.toString() || undefined)
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
