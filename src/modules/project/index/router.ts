import Validation from '../../../helper/validation'
import ProjectController from './controller'
import { Router } from 'express'
import {
  addEmployeeSchema,
  addLabelSchema,
  createProjectSchema,
  updateProjectSchema,
} from './schema'

export default class ProjectRouter {
  public router: Router
  private createProjectSchema: Validation = new Validation(createProjectSchema)
  private updateProjectSchema: Validation = new Validation(updateProjectSchema)
  private addLabel: Validation = new Validation(addLabelSchema)
  private addEmployee: Validation = new Validation(addEmployeeSchema)
  private controller: ProjectController = new ProjectController()

  constructor() {
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post(
      '/',
      this.createProjectSchema.validate,
      this.controller.handleCreate
    )
    this.router.patch(
      '/:id',
      this.updateProjectSchema.validate,
      this.controller.handleUpdate
    )
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
    this.router.get('/list/pagination', this.controller.handleReadByPagination)
 
    this.router.patch('/employee/add/:projectId', this.addEmployee.validate, this.controller.handleAddEmployee)
    this.router.patch('/employee/remove/:id', this.controller.handleRemoveEmployee)
    this.router.patch('/label/add/:projectId', this.addLabel.validate, this.controller.handleAddLabel)
    this.router.patch('/label/remove/:id', this.controller.handleRemoveLabel)
   
    this.router.get('/data/total', this.controller.readTotalHandler)
  }
}
