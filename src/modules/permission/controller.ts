import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../helper/api-response'
import prisma from '../../../lib/prisma'

export default class PermissionController {
  private response: ApiResponse = new ApiResponse()

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body
      await prisma.permission.create({
        data: {
          name,
        },
      })
      return this.response.success(res, 'success create permission')
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { name } = req.body

      await prisma.permission.update({
        data: {
          name,
        },
        where: {
          id: Number(id),
        },
      })

      return this.response.success(res, 'success update permission')
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await prisma.permission.delete({
        where: {
          id: Number(id),
        },
      })

      return this.response.success(res, 'success delete permission')
    } catch (error) {
      next(error)
    }
  }

  read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await prisma.permission.findMany({
        orderBy: {
          name: 'asc',
        },
      })
      return this.response.success(res, 'success get permission', data)
    } catch (error) {
      next(error)
    }
  }
}
