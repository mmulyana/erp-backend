import { Router } from 'express'
import Validation from '../../../helper/validation'
import { employeeSchema } from './schema'
import EmployeeController from './controller'

export default class EmployeeRouter {
  public router: Router
  private employeeSchema: Validation = new Validation(employeeSchema)
  private controller: EmployeeController = new EmployeeController()

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

    this.router.post('/address/:id')
    this.router.patch('/address/:id')
    this.router.delete('/address/:id')
    this.router.get('/address/:id')

    this.router.post('/contact/:id')
    this.router.patch('/contact/:id')
    this.router.delete('/contact/:id')
    this.router.get('/contact/:id')

    this.router.patch('/position/:id')

    this.router.patch('/status/active/:id')
    this.router.patch('/status/unactive/:id')

    this.router.post('/competency/:id')
    this.router.patch('/competency/:id')
    this.router.delete('/competency/:id')
    this.router.get('/competency/:id')

    this.router.post('/certification/:id')
    this.router.patch('/certification/:id')
    this.router.delete('/certification/:id')
    this.router.get('/certification/:id')
  }
}
