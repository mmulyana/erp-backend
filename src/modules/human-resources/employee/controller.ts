import { NextFunction, Request, Response } from 'express'
import ApiResponse from '../../../helper/api-response'
import { MESSAGE_SUCCESS } from '../../../utils/constant/success'

export default class EmployeeController {
  private response: ApiResponse = new ApiResponse()

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, nickname, hireDate, salary, positionId } =
        req.body

      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.CREATE)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, nickname, hireDate, salary, positionId } =
        req.body
      const { id } = req.params
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.UPDATE)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.DELETE)
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.READ)
    } catch (error) {
      next(error)
    }
  }
  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      this.response.success(res, MESSAGE_SUCCESS.EMPLOYEE.READ)
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
