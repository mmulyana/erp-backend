import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import Repository from './repository'

export default class GoodsController extends BaseController {
  private repository: Repository = new Repository()

  constructor() {
    super('Barang')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create({
        ...req.body,
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
      const data = await this.repository.update(Number(id), {
        ...req.body,
        ...(req.file?.filename
          ? { newPhotoUrl: req.file?.filename }
          : undefined),
      })
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
  softDeleteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.repository.softDelete(Number(id))
      return this.response.success(res, this.message.successDelete())
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
      const {
        name,
        page,
        limit,
        brandId,
        categoryId,
        measurementId,
        locationId,
      } = req.query

      const data = await this.repository.readByPagination(
        Number(page) || 1,
        Number(limit) || 10,
        {
          name: name ? String(name) : undefined,
          brandId: brandId ? Number(brandId) : undefined,
          categoryId: categoryId ? Number(categoryId) : undefined,
          measurementId: measurementId ? Number(measurementId) : undefined,
          locationId: locationId ? Number(locationId) : undefined,
        }
      )
      return this.response.success(res, this.message.successRead(), data)
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
  readOneHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.readOne(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readLowStockHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.readLowStock()
      return this.response.success(
        res,
        this.message.successReadField('hampir habis'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  readOutOfStockHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.readOutofStock()
      return this.response.success(
        res,
        this.message.successReadField('hampir habis'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
