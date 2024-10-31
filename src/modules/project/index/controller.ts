import BaseController from '../../../helper/base-controller'
import { NextFunction, Request, Response } from 'express'
import ProjectRepository from './repository'

export default class ProjectController extends BaseController {
  private repository: ProjectRepository = new ProjectRepository()

  constructor() {
    super('Proyek')
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
  handleAddEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { projectId } = req.params
      const { employeeId } = req.body
      const data = await this.repository.addEmployee(
        Number(projectId),
        Number(employeeId)
      )
      return this.response.success(
        res,
        this.message.successCreateField('pegawai'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleRemoveEmployee = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.removeEmployee(Number(id))
      return this.response.success(
        res,
        this.message.successDeleteField('pegawai'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleAddLabel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params
      const { labelId } = req.body
      const data = await this.repository.addLabel(
        Number(projectId),
        Number(labelId)
      )
      return this.response.success(
        res,
        this.message.successCreateField('label'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleRemoveLabel = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.removeLabel(Number(id))
      return this.response.success(
        res,
        this.message.successDeleteField('label'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
