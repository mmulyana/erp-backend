import { Router } from 'express'
import AttendanceController from './controller'
import Validation from '../../../helper/validation'
import { createAttendanceSchema, updateAttendanceSchema } from './schema'

export default class AttendanceRouter {
  public router: Router
  private createAttendanceSchema: Validation = new Validation(createAttendanceSchema)
  private updateAttendanceSchema: Validation = new Validation(updateAttendanceSchema)
  private controller: AttendanceController = new AttendanceController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.createAttendanceSchema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.updateAttendanceSchema.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
