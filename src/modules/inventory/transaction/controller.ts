import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import { TransactionType } from '@prisma/client'
import Repository from './repository'

export default class TransactionController extends BaseController {
  private repository: Repository = new Repository()

  constructor() {
    super('Transaksi')
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
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, goodsId } = req.query
      const data = await this.repository.read(
        type ? String(type) : undefined,
        Number(goodsId)
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
  readByProjectIdHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params
      const data = await this.repository.findByProjectId(Number(projectId))
      return this.response.success(res, this.message.successRead(), data)
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
      const {
        page,
        limit,
        goodsId,
        supplierId,
        startDate,
        endDate,
        type,
        projectId,
      } = req.query
      const data = await this.repository.readByPagination(
        Number(page) || 1,
        Number(limit) || 10,
        {
          goodsId: goodsId ? Number(goodsId) : undefined,
          supplierId: supplierId ? Number(supplierId) : undefined,
          startDate: startDate ? String(startDate) : undefined,
          endDate: endDate ? String(endDate) : undefined,
          type: type ? (String(type) as TransactionType) : 'in',
          projectId: projectId ? Number(projectId) : undefined,
        }
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }

  readBorrowedGoodsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.readGoodsBorrowed()
      return this.response.success(
        res,
        this.message.successReadField('dipinjam'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  returnedGoodsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.returnedGoods(Number(id))
      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
}
