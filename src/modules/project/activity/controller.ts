import { NextFunction, Request, Response } from 'express'
import { Server } from 'socket.io'

import {
  MESSAGES_BY_PARENT,
  MESSAGES_BY_PROJECT,
} from '../../../utils/constant/socket'
import ApiResponse from '../../../helper/api-response'
import Message from '../../../utils/constant/message'
import AccountService from '../../account/service'
import Repository from './repository'

export default class ActivityController {
  private AccountService: AccountService = new AccountService()
  private response: ApiResponse = new ApiResponse()
  private repository: Repository = new Repository()
  private message: Message
  private io: Server

  constructor(io: Server) {
    this.message = new Message('Aktivitas ')
    this.io = io
  }

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, comment, projectId, replyId } = req.body
      const files = req.files as Express.Multer.File[]

      const user = await this.AccountService.getAccount(Number(userId))

      // create comment
      const data = await this.repository.create({
        comment: comment,
        userId: Number(userId),
        projectId: Number(projectId),
        replyId: replyId ? Number(replyId) : null,
        updated_at: new Date(),
        name: user.name,
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
      const files = req.files as Express.Multer.File[]

      const data = await this.repository.update(Number(id), {
        comment: req.body.comment,
        updated_at: new Date(),
      })

      // handle lampiran baru
      if (!!files.length) {
        await this.repository.uploadAttachments(files, data.id)
      }

      // handle lampiran dihapus
      const deleted = req.body.deletedPhoto
        ? req.body.deletedPhoto.split(',')
        : []
      if (!!deleted.length) {
        const ids = deleted.map((item: string) => Number(item))
        await this.repository.removeAttachment({ ids })
      }

      console.log('update query', req.query.type)
      console.log(data)

      this.updateMessageIO({
        type: String(req.query.type) || 'project',
        projectId: data.projectId,
        replyId: data.replyId,
      })

      return this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.delete(Number(id))

      console.log('delete query', req.query.type)
      console.log(data)

      this.updateMessageIO({
        type: String(req.query.type) || 'project',
        projectId: data.projectId,
        replyId: data.replyId,
      })

      return this.response.success(res, this.message.successDelete(), data)
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

      this.updateMessageIO({
        type: String(req.body.type) || 'project',
        projectId: Number(req.body.projectId),
        replyId: Number(req.body.replyId),
      })

      return this.response.success(
        res,
        this.message.successCreateField('likes'),
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
    replyId?: number | null
  }) => {
    if (type === 'detail' && replyId) {
      const room = `detail-${replyId}`
      const data = await this.repository.findByParent(replyId)
      this.io.to(room).emit(MESSAGES_BY_PARENT, data)
    }

    const room = `project-${projectId}`
    const data = await this.repository.findByProject(projectId)
    this.io.to(room).emit(MESSAGES_BY_PROJECT, data)
  }
}
