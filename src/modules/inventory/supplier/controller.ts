import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import SupplierRepository from './repository'

export default class SupplierController extends BaseController {
  private repository: SupplierRepository = new SupplierRepository()

  constructor() {
    super('supplier')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : [req.body.tags].filter(Boolean)

      const data = await this.repository.create({
        ...req.body,
        photoUrl: req.file?.filename,
        tags,
      })
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.update(Number(id), {
        ...req.body,
        photoUrl: req.file?.filename,
      })
      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
  updateTagsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.updateTag(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate(), data)
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
      const { name, tag } = req.query
      const data = await this.repository.read(name?.toString(), Number(tag))
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
  readTransactionHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.readTransactionBySupplierId(Number(id))
      return this.response.success(
        res,
        this.message.successReadField('transaksi'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
