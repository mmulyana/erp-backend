import { NextFunction, Request, Response } from 'express'
import { CustomRequest } from '../../../utils/types/common'
import ApiResponse from '../../../helper/api-response'
import RolesRepository from './repository'
import { Prisma } from '@prisma/client'
import db from '../../../lib/db'

export default class RoleController {
  private response: ApiResponse = new ApiResponse()
  private repository: RolesRepository = new RolesRepository()

  createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, permissionIds } = req.body

      await this.repository.create(name, permissionIds || [])

      return this.response.success(res, 'succes create roles')
    } catch (error) {
      next(error)
    }
  }

  updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, permissionIds } = req.body
      const { id } = req.params
      this.repository.update(Number(id), { name, permissionIds })
      return this.response.success(res, 'succes update roles')
    } catch (error) {
      next(error)
    }
  }

  deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await db.role.delete({
        where: {
          id: Number(id),
        },
      })
      return this.response.success(res, 'succes delete roles')
    } catch (error) {
      next(error)
    }
  }

  readRole = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      return this.response.success(res, 'success read role', data)
    } catch (error) {
      next(error)
    }
  }

  readRoles = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readAll()
      return this.response.success(res, 'success get roles', data)
    } catch (error) {
      next(error)
    }
  }
}
