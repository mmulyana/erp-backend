import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../helper/base-controller'
import Repository from './repository'

export default class ActivityController extends BaseController {
  private repository: Repository = new Repository()

  constructor() {
    super('Aktivitas')
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate(), data)
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
      const data = await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }
  handleRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, projectId } = req.query
      const data = await this.repository.read(Number(projectId), Number(id))
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  handleToggleLike = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.toggleLike(req.body)
      return this.response.success(
        res,
        this.message.successCreateField('likes'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleUploadAttachments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const files = req.files as Express.Multer.File[]
      const { id } = req.params

      if (!files || files.length === 0) {
        return this.response.error(res, 'No files uploaded', 400)
      }
      const data = await this.repository.uploadAttachments(files, Number(id))
      return this.response.success(
        res,
        this.message.successCreateField('attachments'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleRemoveAttachments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.removeAttachment(req.body)
      return this.response.success(
        res,
        this.message.customMessage('berhasil merubah photo'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleChangeAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { attachmentId } = req.params
      const file = req.file as Express.Multer.File

      if (!file) {
        return this.response.error(res, 'No files uploaded', 400)
      }

      const data = await this.repository.changeAttachment(
        Number(attachmentId),
        file
      )
      return this.response.success(
        res,
        this.message.successUpdateField('photo'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
