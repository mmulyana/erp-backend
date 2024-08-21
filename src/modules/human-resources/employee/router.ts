import { Router } from 'express'
import {
  addressSchema,
  createCompetencySchema,
  contactSchema,
  employeeSchema,
  positionSchema,
  updateCompetencySchema,
  certifchema,
} from './schema'
import Validation from '../../../helper/validation'
import EmployeeController from './controller'

export default class EmployeeRouter {
  public router: Router
  private controller: EmployeeController = new EmployeeController()
  private createComptencySchema: Validation = new Validation(createCompetencySchema)
  private updateComptencySchema: Validation = new Validation(updateCompetencySchema)
  private employeeSchema: Validation = new Validation(employeeSchema)
  private positionSchema: Validation = new Validation(positionSchema)
  private addressSchema: Validation = new Validation(addressSchema)
  private contactSchema: Validation = new Validation(contactSchema)
  private certifSchema: Validation = new Validation(certifchema)

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.patch('/:id',this.employeeSchema.validate,this.controller.updateHandler)
    this.router.post('/',this.employeeSchema.validate,this.controller.createHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readAllHandler)
    this.router.get('/:id', this.controller.readHandler)

    this.router.post('/address/:employeeId', this.addressSchema.validate,this.controller.createAddressHandler)
    this.router.patch('/address/:addressId', this.addressSchema.validate,this.controller.updateAddressHandler)
    this.router.delete('/address/:addressId', this.controller.deleteAddressHandler)
    this.router.get('/address/:employeeId', this.controller.readAddressHandler)

    this.router.post('/contact/:employeeId',this.contactSchema.validate,this.controller.createContactHandler)
    this.router.patch('/contact/:contactId',this.contactSchema.validate,this.controller.updateContactHandler)
    this.router.delete('/contact/:contactId',this.controller.deleteContactHandler)
    this.router.get('/contact/:employeeId', this.controller.readContactHandler)

    this.router.patch('/position/:id',this.positionSchema.validate,this.controller.positionHandler)

    this.router.patch('/status/active/:employeeId', this.controller.activeHandler)
    this.router.patch('/status/unactive/:employeeId', this.controller.unactiveHandler)
    this.router.get('/status/track/:employeeId', this.controller.employeeTrackHandler)

    this.router.post('/competency/:employeeId',this.createComptencySchema.validate,this.controller.createCompetencyHandler)
    this.router.patch('/competency/:competencyId',this.updateComptencySchema.validate,this.controller.updateCompetencyHandler)
    this.router.delete('/competency/:competencyId',this.controller.deleteCompetencyHandler)
    this.router.get('/competency/:employeeId', this.controller.readCompetencyHandler)

    this.router.post('/certification/:competencyId', this.certifSchema.validate, this.controller.createCertifHandler)
    this.router.patch('/certification/:certifId', this.certifSchema.validate, this.controller.updateCertifHandler)
    this.router.delete('/certification/:certifId', this.controller.deleteCertifHandler)
    this.router.get('/certification/:competencyId', this.controller.readCertifHandler)
  }
}
