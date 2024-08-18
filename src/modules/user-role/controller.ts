import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../helper/api-response'
import UserRoleRepository from './repository'

export default class UserRoleController {
  private response: ApiResponse = new ApiResponse()
  private repository: UserRoleRepository = new UserRoleRepository()

  private getIds = (ids: string[]): number[] =>
    ids.map((id: string) => Number(id))

  addRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, userId } = req.body
      const payload: number[] = this.getIds(ids)

      this.repository.create(payload, Number(userId))

      return this.response.success(res, 'success added roles for this user')
    } catch (error) {
      next(error)
    }
  }
  updateRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ids, userId } = req.body
      const payload: number[] = this.getIds(ids)

      this.repository.update(payload, Number(userId))

      return this.response.success(res, 'success update roles for this user')
    } catch (error) {
      next(error)
    }
  }
  removeRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body
      this.repository.delete(Number(userId))

      return this.response.success(res, 'success remove roles from this user')
    } catch (error) {
      next(error)
    }
  }
}
