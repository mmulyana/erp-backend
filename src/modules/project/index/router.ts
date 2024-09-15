import Validation from '@/helper/validation'
import { Router } from 'express'
import { createProjectSchema, updateProjectSchema } from './schema'
import ProjectController from './controller'

export default class OvertimeRouter {
  public router: Router
  private createProjectSchema: Validation = new Validation(createProjectSchema)
  private updateProjectSchema: Validation = new Validation(updateProjectSchema)
  private controller: ProjectController = new ProjectController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post('/',this.createProjectSchema.validate,this.controller.handleCreate)
    this.router.patch('/:id',this.updateProjectSchema.validate,this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
  }
}
