import DashboardController from './controller'
import { Router } from 'express'

export default class AttendanceRouter {
  private controller: DashboardController = new DashboardController()
  public router: Router

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.get('/total', this.controller.handleTotal)
  }
}
