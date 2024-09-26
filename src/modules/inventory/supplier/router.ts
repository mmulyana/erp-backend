import Validation from '../../../helper/validation'
import Controller from './controller'
import { supplierSchema, updateTagSchema } from './schema'
import RouterWithFile from '../../../helper/router-with-file'
import { Multer } from 'multer'

export default class SupplierRouter extends RouterWithFile {
  private schema: Validation = new Validation(supplierSchema)
  private updateTagSchema: Validation = new Validation(updateTagSchema)
  private controller: Controller = new Controller()

  constructor(upload: Multer) {
    super(upload)
    this.register()
  }

  protected register() {
    this.router.post(
      '/',
      this.upload.single('photo'),
      this.compressImage,
      this.schema.validate,
      this.controller.createHandler
    )
    this.router.patch(
      '/:id',
      this.upload.single('photo'),
      this.compressImage,
      this.schema.validate,
      this.controller.updateHandler
    )
    this.router.patch(
      '/:id',
      this.updateTagSchema.validate,
      this.controller.updateTagsHandler
    )
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
