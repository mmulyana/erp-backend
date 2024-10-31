import { Router } from 'express'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { companySchema } from './schema'
import RouterWithFile from '../../../helper/router-with-file'
import { MulterConfig } from '../../../utils/multer-config'

export default class CompanyRouter extends RouterWithFile {
  private controller: ClientController = new ClientController()
  private companySchema: Validation = new Validation(companySchema)

  constructor(multer: MulterConfig) {
    super(multer.uploadImg, 'company')
    this.register()
  }

  protected register() {
    this.router.post('/', this.upload.single('photo'), this.compressImage, this.companySchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.upload.single('photo'), this.compressImage, this.companySchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
    this.router.get('/:id', this.controller.handleReadOne)
  }
}
