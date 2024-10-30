import { MulterConfig } from '../../../utils/multer-config'
import Validation from '../../../helper/validation'
import ProjectController from './controller'
import { attachmentSchema } from './schema'
import { Router } from 'express'
import { Multer } from 'multer'

export default class AttachmentRouter {
  public router: Router
  private schema: Validation = new Validation(attachmentSchema)
  private controller: ProjectController = new ProjectController()
  private upload: Multer

  constructor(multer: MulterConfig) {
    this.upload = multer.uploadDoc
    this.router = Router()
    this.register()
  }

  protected register() {
    this.router.post(
      '/',
      this.upload.single('file'),
      this.schema.validate,
      this.controller.handleCreate
    )
    this.router.patch(
      '/:id',
      this.upload.single('file'),
      this.schema.validate,
      this.controller.handleUpdate
    )
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/:id', this.controller.handleRead)
  }
}
