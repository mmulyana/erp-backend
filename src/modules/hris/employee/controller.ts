import { NextFunction, Request, Response } from 'express'
import EmployeeRepository, { FilterEmployee } from './repository'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'
import { MESSAGE_ERROR } from '../../../utils/constant/error'
import ApiResponse from '../../../helper/api-response'

export default class EmployeeController {
  private response: ApiResponse = new ApiResponse()
  private repository: EmployeeRepository = new EmployeeRepository()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.repository.create(req.body)
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.update(Number(id), req.body)
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
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      let where: FilterEmployee = {}
      if (req.query.fullname) {
        where.fullname = String(req.query.fullname)
      }
      if (req.query.positionId) {
        where.positionId = Number(req.query.positionId)
      }
      const data = await this.repository.readAll(page, limit, where)
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
      const { employeeId } = req.params
      await this.repository.createAddress(Number(employeeId), req.body)
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
      const { addressId } = req.params
      await this.repository.updateAddress(Number(addressId), req.body)
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
      const { employeeId } = req.params
      const { addressId } = req.query
      const data = await this.repository.readAddress(
        Number(employeeId),
        Number(addressId)
      )
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
      const { employeeId } = req.params
      await this.repository.createContact(Number(employeeId), req.body)
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
      const { contactId } = req.params
      await this.repository.updateContact(Number(contactId), req.body)
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
      const { contactId } = req.params
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
      const { employeeId } = req.params
      const data = await this.repository.readContact(
        Number(employeeId),
        Number(contactId)
      )
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
      const { employeeId } = req.params
      await this.repository.updateStatusEmployee(Number(employeeId), 'active')
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.ACTIVE)
    } catch (error: any) {
      if (
        [
          MESSAGE_ERROR.EMPLOYEE.STATUS.ACTIVE,
          MESSAGE_ERROR.EMPLOYEE.STATUS.UNACTIVE,
        ].includes(error?.message)
      ) {
        error.code = 400
      }
      next(error)
    }
  }
  unactiveHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params
      await this.repository.updateStatusEmployee(
        Number(employeeId),
        'nonactive'
      )
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
      const { employeeId } = req.params
      const data = await this.repository.readEmployeeTrack(Number(employeeId))
      return this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.TRACK, data)
    } catch (error) {
      next(error)
    }
  }

  createCompetencyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { employeeId } = req.params
      await this.repository.createCompetency(Number(employeeId), req.body)
      return this.response.success(
        res,
        MESSAGE_SUCCESS.EMPLOYEE.COMPETENCY.CREATE
      )
    } catch (error) {
      next(error)
    }
  }
  deleteCompetencyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { competencyId } = req.params
      await this.repository.deleteCompetency(Number(competencyId))
      return this.response.success(
        res,
        MESSAGE_SUCCESS.EMPLOYEE.COMPETENCY.DELETE
      )
    } catch (error) {
      next(error)
    }
  }
  readCompetencyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { competencyId } = req.query
      const { employeeId } = req.params
      const data = await this.repository.readCompetency(
        Number(employeeId),
        Number(competencyId)
      )
      return this.response.success(
        res,
        MESSAGE_SUCCESS.EMPLOYEE.COMPETENCY.READ,
        data
      )
    } catch (error) {
      next(error)
    }
  }

  createCertifHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { competencyId } = req.params
      await this.repository.createCertif(Number(competencyId), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CERTIF.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateCertifHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { certifId } = req.params
      await this.repository.updateCertif(Number(certifId), req.body)
      return this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CERTIF.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteCertifHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { certifId } = req.params
      await this.repository.deleteCertif(Number(certifId))
      return this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CERTIF.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readCertifHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { certifId } = req.query
      const { competencyId } = req.params
      const data = await this.repository.readCertif(
        Number(competencyId),
        Number(certifId)
      )
      return this.response.success(
        res,
        MESSAGE_SUCCESS.EMPLOYEE.CERTIF.READ,
        data
      )
    } catch (error) {
      next(error)
    }
  }

  readLeaveHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { employeeId } = req.params
      const data = await this.repository.readLeave(Number(employeeId))
      return this.response.success(res, MESSAGE_SUCCESS.LEAVE.READ, data)
    } catch (error) {
      next(error)
    }
  }
}