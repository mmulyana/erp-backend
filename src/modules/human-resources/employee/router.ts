import { Router } from 'express'
import { addressSchema, createCompetencySchema, contactSchema, employeeSchema, positionSchema, updateCompetencySchema } from './schema'
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

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.patch('/:id', this.employeeSchema.validate, this.controller.updateHandler)
    this.router.post('/', this.employeeSchema.validate, this.controller.createHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readAllHandler)
    this.router.get('/:id', this.controller.readHandler)

    this.router.post('/address/:id', this.addressSchema.validate, this.controller.createAddressHandler)
    this.router.patch('/address', this.addressSchema.validate, this.controller.updateAddressHandler)
    this.router.delete('/address/:addressId', this.controller.deleteAddressHandler)
    this.router.get('/address')

    this.router.post('/contact/:id', this.contactSchema.validate, this.controller.createContactHandler)
    this.router.patch('/contact',this.contactSchema.validate, this.controller.updateContactHandler)
    this.router.delete('/contact/:contactId', this.controller.deleteContactHandler)
    this.router.get('/contact', this.controller.readContactHandler)

    this.router.patch('/position/:id', this.positionSchema.validate, this.controller.positionHandler)

    this.router.patch('/status/active/:id', this.controller.activeHandler)
    this.router.patch('/status/unactive/:id', this.controller.unactiveHandler)
    this.router.get('/status/track/:id', this.controller.employeeTrackHandler)

    this.router.post('/competency/:employeeId', this.createComptencySchema.validate, this.controller.createCompetencyHandler)
    this.router.patch('/competency', this.updateComptencySchema.validate, this.controller.updateCompetencyHandler)
    this.router.delete('/competency/:competencyId')
    this.router.get('/competency')

    this.router.post('/certification/:competencyId')
    this.router.patch('/certification/:certifId')
    this.router.delete('/certification/:certifId')
    this.router.get('/certification')
  }
}
