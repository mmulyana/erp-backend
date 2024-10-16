import Validation from '../../../helper/validation'
import Controller from './controller'
import { supplierSchema, updateTagSchema, updateSchema } from './schema'
import RouterWithFile from '../../../helper/router-with-file'
import { Multer } from 'multer'

export default class SupplierRouter extends RouterWithFile {
  private createSchema: Validation = new Validation(supplierSchema)
  private updateSchema: Validation = new Validation(updateSchema)
  private updateTagSchema: Validation = new Validation(updateTagSchema)
  private controller: Controller = new Controller()

  constructor(upload: Multer) {
    super(upload, 'supplier')
    this.register()
  }

  protected register() {
    this.router.post(
      '/',
      this.upload.single('photo'),
      this.compressImage,
      this.createSchema.validate,
      this.controller.createHandler
    )
    this.router.patch(
      '/:id',
      this.updateSchema.validate,
      this.controller.updateHandler
    )
    this.router.patch(
      '/:id/tags',
      this.updateTagSchema.validate,
      this.controller.updateTagsHandler
    )
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
    this.router.get('/:id', this.controller.readOneHandler)
  }
}
