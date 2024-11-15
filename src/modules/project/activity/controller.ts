import { NextFunction, Request, Response } from 'express'
import BaseController from '../../../helper/base-controller'
import Repository from './repository'
import { Server } from 'socket.io'
import Message from '../../../utils/constant/message'
import ApiResponse from '../../../helper/api-response'
import {
  MESSAGES_BY_PARENT,
  MESSAGES_BY_PROJECT,
} from '../../../utils/constant/socket'

export default class ActivityController {
  protected message: Message
  protected response: ApiResponse = new ApiResponse()
  private repository: Repository = new Repository()
  private io: Server

  constructor(io: Server) {
    this.message = new Message('Aktivitas ')
    this.io = io
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, comment, projectId, replyId, photo } = req.body
      const files = req.files as Express.Multer.File[]

      // create comment
      const data = await this.repository.create({
        comment: comment,
        userId: Number(userId),
        projectId: Number(projectId),
        replyId: replyId ? Number(replyId) : null,
      })

      await this.repository.uploadAttachments(files, data.id)

      this.updateMessageIO({
        type: String(req.query.type) || 'project',
        projectId: Number(req.body.projectId),
        replyId: Number(req.body.replyId),
      })

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

  updateMessageIO = async ({
    type,
    replyId,
    projectId,
  }: {
    type: string
    projectId: number
    replyId?: number
  }) => {
    if (type === 'detail' && replyId) {
      const room = `detail-${replyId}`
      const data = await this.repository.findByParent(replyId)
      this.io.to(room).emit(MESSAGES_BY_PARENT, data)
      return
    }

    const room = `project-${projectId}`
    const data = await this.repository.findByProject(projectId)
    this.io.to(room).emit(MESSAGES_BY_PROJECT, data)
  }
}
