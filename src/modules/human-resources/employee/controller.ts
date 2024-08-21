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
  readAllHandler = async (_: Request, res: Response, next: NextFunction) => {
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
      await this.repository.createAddress(Number(id), payload)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateAddressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
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
      await this.repository.updateAddress(Number(req.body.id), payload)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteAddressHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { addressId } = req.params
      await this.repository.deleteAddress(Number(addressId))
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
      const data = await this.repository.readAddress(Number(addressId))
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ADDRESS.READ, data)
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
      const { id } = req.params
      const payload = {
        type: req.body.type || undefined,
        value: req.body.value,
      }
      await this.repository.createContact(Number(id), payload)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const payload = {
        type: req.body.type || undefined,
        value: req.body.value,
      }
      await this.repository.updateContact(Number(req.body.id), payload)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteContactHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { contactId } = req.body
      await this.repository.deleteContact(Number(contactId))
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
      const { contactId } = req.query
      const data = await this.repository.readContact(Number(contactId))
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CONTACT.READ, data)
    } catch (error) {
      next(error)
    }
  }

  positionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { positionId } = req.body

      await this.repository.updatePositionEmployee(
        Number(id),
        Number(positionId)
      )
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.POSITION)
    } catch (error) {
      next(error)
    }
  }

  activeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.updateStatusEmployee(Number(id), 'active')
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ACTIVE)
    } catch (error) {
      next(error)
    }
  }
  unactiveHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.updateStatusEmployee(Number(id), 'nonactive')
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.UNACTIVE)
    } catch (error) {
      next(error)
    }
  }
  employeeTrackHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.readEmployeeTrack(Number(id))
      return this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.TRACK, data)
    } catch (error) {
      next(error)
    }
  }
}
