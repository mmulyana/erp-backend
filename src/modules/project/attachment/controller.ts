import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import Repository from './repository'

export default class AttachmentController extends BaseController {
  private repository: Repository = new Repository()

  constructor() {
    super('Lampiran')
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.createAttachment({
        ...req.body,
        file: req.file,
        projectId: Number(req.body.projectId),
      })
      return this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }
  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.updateAttachment(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
  handleReadById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.findById(Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  handleRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query
      const data = await this.repository.findAll(
        name ? String(name) : undefined
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.deleteAttachment(Number(id))
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }
}
