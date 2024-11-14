import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import ClientRepository from './repository'

export default class ClientController extends BaseController {
  private repository: ClientRepository = new ClientRepository()

  constructor() {
    super('user')
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate())
    } catch (error) {
      next(error)
    }
  }
  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error) {
      next(error)
    }
  }
  handleRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.read()
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  handleReadByPagination = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit, name } = req.query
      const data = await this.repository.readByPagination(
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined,
        {
          name: name ? String(name) : undefined,
        }
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  handleReadOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.readOne(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  handleTopClientChart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.getTopClients()
      return this.response.success(
        res,
        this.message.successReadField('klien dengan proyek terbanyak'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
