import { Router } from 'express'
import Validation from '../../../helper/validation'
import CashAdvanceController from './controller'
import { cashAdvanceSchema } from './schema'

export default class CashAdvanceRouter {
  public router: Router
  private cashAdvanceSchema: Validation = new Validation(cashAdvanceSchema)
  private controller: CashAdvanceController = new CashAdvanceController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.cashAdvanceSchema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.cashAdvanceSchema.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)

    this.router.get('/list/pagination', this.controller.ReadByPagination)
    this.router.get('/:id', this.controller.readByIdHandler)
    this.router.get('/', this.controller.readAllHandler)

    this.router.get('/data/total-by-month', this.controller.readTotalInYearHandler)
    this.router.get('/data/total', this.controller.readTotalHandler)
  }
}
