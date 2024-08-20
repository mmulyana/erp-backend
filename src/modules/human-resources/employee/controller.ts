import { NextFunction, Request, Response } from 'express'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import ApiResponse from '../../../helper/api-response'
import EmployeeRepository from './repository'

export default class EmployeeController {
  private response: ApiResponse = new ApiResponse()
  private repository: EmployeeRepository = new EmployeeRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName || undefined,
        nickname: req.body.nickname || undefined,
        hireDate: req.body.hireDate || undefined,
        salary: req.body.salary || undefined,
        positionId: req.body.positionId || undefined,
      }
      await this.repository.create(payload)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = {
        firstName: req.body.firstName,
        lastName: req.body.lastName || undefined,
        nickname: req.body.nickname || undefined,
        hireDate: req.body.hireDate || undefined,
        salary: req.body.salary || undefined,
        positionId: req.body.positionId || undefined,
      }
      const { id } = req.params
      await this.repository.update(Number(id), payload)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.READ, data)
    } catch (error) {
      next(error)
    }
  }
  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.readAll()
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.READ, data)
    } catch (error) {
      next(error)
    }
  }

  createAddressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const payload = {
        type: req.body.type || undefined,
        rt: req.body.rt || undefined,
        rw: req.body.rw || undefined,
        kampung: req.body.kampung || undefined,
        desa: req.body.desa || undefined,
        kecamatan: req.body.kecamatan || undefined,
        kebupaten: req.body.kebupaten || undefined,
        provinsi: req.body.provinsi || undefined,
        kodePos: req.body.kodePos || undefined,
      }

      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.CREATE)
    } catch (error) {
      next(error)
    }
  }
  UpdateAddressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const payload = {
        id: req.body.id,
        type: req.body.type || undefined,
        rt: req.body.rt || undefined,
        rw: req.body.rw || undefined,
        kampung: req.body.kampung || undefined,
        desa: req.body.desa || undefined,
        kecamatan: req.body.kecamatan || undefined,
        kebupaten: req.body.kebupaten || undefined,
        provinsi: req.body.provinsi || undefined,
        kodePos: req.body.kodePos || undefined,
      }
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  DeleteAddressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const { addressId } = req.body
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.REMOVE)
    } catch (error) {
      next(error)
    }
  }
  readAddressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { addressId } = req.query
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.READ)
    } catch (error) {
      next(error)
    }
  }

  createContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.CREATE)
    } catch (error) {
      next(error)
    }
  }
  UpdateContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  DeleteContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.REMOVE)
    } catch (error) {
      next(error)
    }
  }
  readContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.READ)
    } catch (error) {
      next(error)
    }
  }

  positionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.POSITION)
    } catch (error) {
      next(error)
    }
  }

  activeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ACTIVE)
    } catch (error) {
      next(error)
    }
  }
  unactiveHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.UNACTIVE)
    } catch (error) {
      next(error)
    }
  }
}
