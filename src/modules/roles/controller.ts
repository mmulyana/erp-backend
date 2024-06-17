import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../helper/api-response'
import prisma from '../../../lib/prisma'
import { Prisma } from '@prisma/client'

export default class RoleController {
  private response: ApiResponse = new ApiResponse()

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body
      await prisma.roles.create({
        data: {
          name,
        },
      })
      return this.response.success(res, 'succes create roles')
    } catch (error) {
      next(error)
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body
      const { id } = req.params
      await prisma.roles.update({
        data: {
          name,
        },
        where: {
          id: Number(id),
        },
      })
      return this.response.success(res, 'succes update roles')
    } catch (error) {
      next(error)
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await prisma.roles.delete({
        where: {
          id: Number(id),
        },
      })
      return this.response.success(res, 'succes delete roles')
    } catch (error) {
      next(error)
    }
  }

  read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await prisma.roles.findMany({
        orderBy: {
          name: 'asc',
        },
      })

      return this.response.success(res, 'success get roles', roles)
    } catch (error) {
      next(error)
    }
  }

  add = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, rolesId } = req.body
      await prisma.user.update({
        where: {
          name,
        },
        data: {
          rolesId,
        },
      })
      return this.response.success(res, 'succes add roles')
    } catch (error) {
      next(error)
    }
  }

  change = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, rolesId } = req.body
      await prisma.user.update({
        where: {
          name,
        },
        data: {
          rolesId,
        },
      })
      return this.response.success(res, 'succes change roles')
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          return next({ message: 'Foreign key constraint violation' })
        }
      }
      next(error)
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body
      await prisma.user.update({
        where: {
          name,
        },
        data: {
          rolesId: null,
        },
      })
      return this.response.success(res, 'succes remove roles')
    } catch (error) {
      next(error)
    }
  }
}
