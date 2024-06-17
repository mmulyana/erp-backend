import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../helper/api-response'
import prisma from '../../../lib/prisma'

export default class RolesPermissionController {
  private response: ApiResponse = new ApiResponse()

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rolesId, permissionId, enabled } = req.body
      await prisma.rolesPermission.create({
        data: {
          rolesId,
          permissionId,
          enabled,
        },
      })
      return this.response.success(res, 'success create role permission')
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { rolesId, permissionId, enabled } = req.body
      await prisma.rolesPermission.update({
        data: {
          enabled,
          permissionId,
          rolesId,
        },
        where: {
          id: Number(id),
        },
      })
      this.response.success(res, 'success update role permission')
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      await prisma.rolesPermission.delete({
        where: {
          id: Number(id),
        },
      })

      return this.response.success(res, 'success delete role permission')
    } catch (error) {
      next(error)
    }
  }

  read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await prisma.rolesPermission.findUnique({
        where: {
          id: Number(id),
        },
      })

      if (!data) {
        throw new Error('role permission not found')
      }

      return this.response.success(res, 'success get role permission', data)
    } catch (error: any) {
      if (error.message === 'role permission not found') {
        error.code = 404
      }
      next(error)
    }
  }
}
