import { NextFunction, Request, Response } from 'express'
import BaseController from '../../helper/base-controller'
import { PermissionRepository } from './repository'

export default class PermissionController extends BaseController {
  private repository: PermissionRepository = new PermissionRepository()

  constructor() {
    super('Hak istimewa')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body
      const permission = await this.repository.findByName(name)
      if (permission) {
        throw new Error('Hak istimewa ini sudah ada')
      }
      await this.repository.create(req.body)
      return this.response.success(res, this.message.successCreate())
    } catch (error: any) {
      if (error.message.includes('sudah ada')) {
        error.code = 401
      }
      next(error)
    }
  }

  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const permission = await this.repository.findById(Number(id))

      if (!permission) {
        throw new Error('Hak istimewa tidak ditemukan')
      }

      if (req.body.name && req.body.name !== permission.name) {
        const existingPermission = await this.repository.findByName(
          req.body.name
        )
        if (existingPermission) {
          throw new Error('Nama hak istimewa sudah digunakan')
        }
      }

      await this.repository.update(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate())
    } catch (error: any) {
      if (error.message.includes('tidak ditemukan')) {
        error.code = 404
      } else if (error.message.includes('sudah digunakan')) {
        error.code = 401
      }
      next(error)
    }
  }

  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const permission = await this.repository.findById(Number(id))

      if (!permission) {
        throw new Error('Hak istimewa tidak ditemukan')
      }

      await this.repository.delete(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error: any) {
      if (error.message.includes('tidak ditemukan')) {
        error.code = 404
      }
      next(error)
    }
  }

  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, groupId } = req.query
      const where: { name?: string; groupId?: number } = {}

      if (name) {
        where.name = String(name)
      }

      if (groupId) {
        where.groupId = Number(groupId)
      }

      const permissions = await this.repository.findAll({
        where: Object.keys(where).length > 0 ? where : undefined,
      })

      return this.response.success(res, this.message.successRead(), permissions)
    } catch (error) {
      next(error)
    }
  }

  // New group handlers
  createGroupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name } = req.body
      const groups = await this.repository.findAllGroup({
        where: { name },
      })

      if (groups.length > 0) {
        throw new Error('Grup hak istimewa ini sudah ada')
      }

      const group = await this.repository.createGroup(req.body)
      return this.response.success(res, this.message.successCreate(), group)
    } catch (error: any) {
      if (error.message.includes('sudah ada')) {
        error.code = 401
      }
      next(error)
    }
  }

  updateGroupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const group = await this.repository.findByIdGroup(Number(id))

      if (!group) {
        throw new Error('Grup hak istimewa tidak ditemukan')
      }

      if (req.body.name && req.body.name !== group.name) {
        const groups = await this.repository.findAllGroup({
          where: { name: req.body.name },
        })
        if (groups.length > 0) {
          throw new Error('Nama grup hak istimewa sudah digunakan')
        }
      }

      const updatedGroup = await this.repository.updateGroup(
        Number(id),
        req.body
      )
      return this.response.success(
        res,
        this.message.successUpdate(),
        updatedGroup
      )
    } catch (error: any) {
      if (error.message.includes('tidak ditemukan')) {
        error.code = 404
      } else if (error.message.includes('sudah digunakan')) {
        error.code = 401
      }
      next(error)
    }
  }

  deleteGroupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const group = await this.repository.findByIdGroup(Number(id))

      if (!group) {
        throw new Error('Grup hak istimewa tidak ditemukan')
      }

      await this.repository.deleteGroup(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error: any) {
      if (error.message.includes('tidak ditemukan')) {
        error.code = 404
      }
      next(error)
    }
  }

  readAllGroupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { name } = req.query
      const where = name ? { name: String(name) } : undefined

      const groups = await this.repository.findAllGroup({ where })
      return this.response.success(res, this.message.successRead(), groups)
    } catch (error) {
      next(error)
    }
  }

  addPermissionsToGroupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { permissionIds } = req.body

      const group = await this.repository.findByIdGroup(Number(id))
      if (!group) {
        throw new Error('Grup hak istimewa tidak ditemukan')
      }

      // Validate all permission IDs exist
      for (const permissionId of permissionIds) {
        const permission = await this.repository.findById(permissionId)
        if (!permission) {
          throw new Error(
            `Hak istimewa dengan ID ${permissionId} tidak ditemukan`
          )
        }
      }

      const updatedGroup = await this.repository.addPermissionsGroup(
        Number(id),
        {
          permissionIds,
        }
      )

      return this.response.success(
        res,
        'Berhasil menambahkan hak istimewa ke grup',
        updatedGroup
      )
    } catch (error: any) {
      if (error.message.includes('tidak ditemukan')) {
        error.code = 404
      }
      next(error)
    }
  }

  removePermissionsFromGroupHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { permissionIds } = req.body

      const group = await this.repository.findByIdGroup(Number(id))
      if (!group) {
        throw new Error('Grup hak istimewa tidak ditemukan')
      }

      const updatedGroup = await this.repository.removePermissionsGroup(
        Number(id),
        {
          permissionIds,
        }
      )

      return this.response.success(
        res,
        'Berhasil menghapus hak istimewa dari grup',
        updatedGroup
      )
    } catch (error: any) {
      if (error.message.includes('tidak ditemukan')) {
        error.code = 404
      }
      next(error)
    }
  }
}
