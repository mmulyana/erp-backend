import { NextFunction, Request, Response } from 'express'
import EmployeeRepository, { FilterEmployee } from './repository'
import BaseController from '../../../helper/base-controller'

export default class EmployeeController extends BaseController {
  private repository: EmployeeRepository = new EmployeeRepository()

  constructor() {
    super('Pegawai')
  }

  // EMPLOYEE
  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.create(req.body)
      this.response.success(res, this.message.successCreate(), data)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.update(Number(id), req.body)
      this.response.success(res, this.message.successUpdate(), data)
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      await this.repository.delete(Number(id))
      this.response.success(res, this.message.successDelete())
    } catch (error) {
      next(error)
    }
  }
  softDeleteHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.repository.softDelete(Number(id))
      this.response.success(res, this.message.successDelete())
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = await this.repository.read(Number(id))
      this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readByPaginationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = Number(req.query.page) || 1
      const limit = Number(req.query.limit) || 10
      let where: FilterEmployee = {}
      if (req.query.name) {
        where.fullname = String(req.query.name)
      }
      if (req.query.positionId) {
        where.positionId = Number(req.query.positionId)
      }
      const data = await this.repository.readByPagination(page, limit, where)
      this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  readAllHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let where: FilterEmployee = {}
      if (req.query.name) {
        where.fullname = String(req.query.name)
      }
      if (req.query.positionId) {
        where.positionId = Number(req.query.positionId)
      }
      const data = await this.repository.findAll(where)
      this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }

  // PHOTO
  uploadPhotoHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params

      if (req.file?.fieldname) {
        const data = await this.repository.updatePhoto(
          Number(id),
          req.file.filename
        )
        this.response.success(res, this.message.successCreate(), data)
      }
    } catch (error) {
      next(error)
    }
  }
  deletePhotoHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      const data = await this.repository.deletePhoto(Number(id))
      this.response.success(res, this.message.successUpdateField('photo'), data)
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
      const data = await this.repository.createAddress(
        Number(employeeId),
        req.body
      )
      this.response.success(
        res,
        this.message.successCreateField('alamat'),
        data
      )
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
      const data = await this.repository.updateAddress(
        Number(addressId),
        req.body
      )
      this.response.success(
        res,
        this.message.successUpdateField('alamat'),
        data
      )
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
      const data = await this.repository.deleteAddress(Number(addressId))
      this.response.success(
        res,
        this.message.successDeleteField('alamat'),
        data
      )
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
      this.response.success(res, this.message.successRead(), data)
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
      const data = await this.repository.createContact(
        Number(employeeId),
        req.body
      )
      this.response.success(
        res,
        this.message.successCreateField('nomor telp'),
        data
      )
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
      const data = await this.repository.updateContact(
        Number(contactId),
        req.body
      )
      this.response.success(
        res,
        this.message.successUpdateField('nomor telp'),
        data
      )
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
      const data = await this.repository.deleteContact(Number(contactId))
      this.response.success(
        res,
        this.message.successDeleteField('nomor telp'),
        data
      )
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
      this.response.success(
        res,
        this.message.successReadField('Nomor telp'),
        data
      )
    } catch (error) {
      next(error)
    }
  }

  positionHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { positionId } = req.body

      const data = await this.repository.updatePositionEmployee(
        Number(id),
        Number(positionId)
      )
      this.response.success(
        res,
        this.message.successUpdateField('jabatan'),
        data
      )
    } catch (error) {
      next(error)
    }
  }

  activeHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params
      const data = await this.repository.updateStatusEmployee(
        Number(employeeId),
        true,
        req.body
      )
      this.response.success(res, this.message.successActive(), data)
    } catch (error) {
      next(error)
    }
  }
  inactiveHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { employeeId } = req.params
      const data = await this.repository.updateStatusEmployee(
        Number(employeeId),
        false,
        req.body
      )
      this.response.success(res, this.message.successInactive(), data)
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
      return this.response.success(
        res,
        this.message.successReadField('Aktivasi'),
        data
      )
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
        this.message.successCreateField('kompetensi')
      )
    } catch (error) {
      next(error)
    }
  }
  createSingleCompetencyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { employeeId } = req.params
      const data = await this.repository.createSingleCompetency(
        Number(employeeId),
        req.body
      )
      return this.response.success(
        res,
        this.message.successCreateField('kompetensi'),
        data
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
      const data = await this.repository.deleteCompetency(Number(competencyId))
      return this.response.success(
        res,
        this.message.successDeleteField('kompetensi'),
        data
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
        this.message.successReadField('kompetensi'),
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
      const { employeeId } = req.params

      const formData = req.body

      if (Array.isArray(req.files)) {
        formData.certif_file = (req.files as Express.Multer.File[]).map(
          (file) => file.filename
        )
      } else if (req.file) {
        formData.certif_file = req.file.filename
      }

      const dataArray = Object.keys(formData).reduce((acc: any[], key) => {
        const value = formData[key]
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (!acc[index]) acc[index] = {}
            acc[index][key] = item
          })
        } else {
          if (!acc[0]) acc[0] = {}
          acc[0][key] = value
        }
        return acc
      }, [])

      await this.repository.createCertif(Number(employeeId), dataArray)
      return this.response.success(
        res,
        this.message.successCreateField('sertifikat')
      )
    } catch (error) {
      next(error)
    }
  }
  createSingleHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { employeeId } = req.params
      const data = await this.repository.createSingleCertif(
        Number(employeeId),
        { ...req.body, certif_file: req?.file?.filename }
      )
      return this.response.success(
        res,
        this.message.successCreateField('sertifikat'),
        data
      )
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
      const data = await this.repository.updateCertif(Number(certifId), {
        ...req.body,
        certif_file: req?.file?.filename,
      })
      return this.response.success(
        res,
        this.message.successUpdateField('sertifikat'),
        data
      )
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
      const data = await this.repository.deleteCertif(Number(certifId))
      return this.response.success(
        res,
        this.message.successDeleteField('sertifikat'),
        data
      )
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
        this.message.successReadField('sertifikat'),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  updateCompetenciesHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params
      await this.repository.updateCompentencies(Number(id), req.body)
      return this.response.success(
        res,
        this.message.successUpdateField('kompetensi')
      )
    } catch (error) {
      next(error)
    }
  }

  readExpiringCertificationHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { positionId } = req.query
      const data = await this.repository.getExpiringCertificates(
        positionId ? Number(positionId) : undefined
      )
      return this.response.success(
        res,
        this.message.customMessage(
          'yang sertifikatnya akan dan sudah kadaluwarsa'
        ),
        data
      )
    } catch (error) {
      next(error)
    }
  }
  readExpiringSafetyHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { positionId } = req.query
      const data = await this.repository.getExpiringSafety(
        positionId ? Number(positionId) : undefined
      )
      return this.response.success(
        res,
        this.message.customMessage(
          'yang safety induction akan dan sudah kadaluwarsa'
        ),
        data
      )
    } catch (error) {
      next(error)
    }
  }
}
