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
      const { id, search, labelId, clientId, isArchive } = req.query
      const data = await this.repository.read(
        Number(id),
        search?.toString(),
        Number(labelId),
        Number(clientId),
        isArchive ? isArchive === 'true' : false
      )
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
      const { search, labelId, clientId, page, limit, isArchive } = req.query
      const data = await this.repository.readByPagination(
        page ? Number(page) : undefined,
        limit ? Number(limit) : undefined,
        {
          search: search ? String(search) : undefined,
          clientId: clientId ? Number(clientId) : undefined,
          labelId: labelId ? Number(labelId) : undefined,
          isArchive: isArchive ? isArchive === 'true' : false,
        }
      )
      return this.response.success(res, this.message.successRead(), data)
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
  readTotalHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await this.repository.getTotalProject()
      return this.response.success(
        res,
        this.message.successReadField('total'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  updateStatusHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id, containerId } = req.params
      const data = await this.repository.updateStatus(
        Number(id),
        String(containerId)
      )
      return this.response.success(
        res,
        this.message.successUpdateField('status'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  handleFindEmployeeByProjectId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.findEmployeeByProjectId(Number(id))
      return this.response.success(
        res,
        this.message.successUpdateField('pegawai untuk'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
