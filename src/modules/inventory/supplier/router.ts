import RouterWithFile from '../../../helper/router-with-file'
import Controller from './controller'
import { Multer } from 'multer'

export default class SupplierRouter extends RouterWithFile {
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
      // this.createSchema.validate,
      this.controller.createHandler
    )
    this.router.patch(
      '/:id',
      // this.updateSchema.validate,
      this.controller.updateHandler
    )
    this.router.patch(
      '/:id/tags',
      // this.updateTagSchema.validate,
      this.controller.updateTagsHandler
    )
    this.router.get('/', this.controller.readHandler)
    this.router.get('/:id', this.controller.readOneHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/:id/transaction', this.controller.readTransactionHandler)
  }
}
