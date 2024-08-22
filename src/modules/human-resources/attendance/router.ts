import { Router } from 'express'
import { attendanceSchema } from './schema'
import AttendanceController from './controller'
import Validation from '../../../helper/validation'

export default class AttendanceRouter {
  public router: Router
  private attendanceSchema: Validation = new Validation(attendanceSchema)
    private controller: AttendanceController = new AttendanceController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.attendanceSchema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.attendanceSchema.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
