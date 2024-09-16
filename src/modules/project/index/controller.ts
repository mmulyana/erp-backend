import { NextFunction, Request, Response } from 'express'
import ProjectRepository from './repository'
import ApiResponse from '../../../helper/api-response'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'

export default class ProjectController {
  private response: ApiResponse = new ApiResponse()
  private repository: ProjectRepository = new ProjectRepository()

  handleCreate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      return this.response.success(res, MESSAGE_SUCCESS.PROJECT.CREATE)
    } catch (error) {
      next(error)
    }
  }
  handleUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.PROJECT.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  handleDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.PROJECT.DELETE)
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
      return this.response.success(res, MESSAGE_SUCCESS.PROJECT.READ, data)
    } catch (error) {
      next(error)
    }
  }
}
