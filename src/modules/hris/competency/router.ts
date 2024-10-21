import { Router } from 'express'
import Validation from '../../../helper/validation'
import { competencySchema } from './schema'
import CompetencyController from './controller'

export default class CompetencyRouter {
  public router: Router
  private competencySchema: Validation = new Validation(competencySchema)
  private controller: CompetencyController = new CompetencyController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/', this.competencySchema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.competencySchema.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
    this.router.get('/:id', this.controller.readOneHandler)
  }
}
