import { NextFunction, Request, Response } from 'express'
import ProjectRepository from './repository'
import ApiResponse from '../../../helper/api-response'
import Message from '../../../utils/constant/message'

export default class ProjectController {
  private response: ApiResponse = new ApiResponse()
  private repository: ProjectRepository = new ProjectRepository()
  private message: Message = new Message('Proyek')

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
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate())
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
      const { id, search, labelId, clientId } = req.query
      const data = await this.repository.read(
        Number(id),
        search?.toString(),
        Number(labelId),
        Number(clientId)
      )
      return this.response.success(res, this.message.successDelete(), data)
    } catch (error) {
      next(error)
    }
  }
}
