import { Multer } from 'multer'
import RouterWithFile from '../../../helper/router-with-file'
import Validation from '../../../helper/validation'
import Controller from './controller'
import { schema } from './schema'

export default class TransactionRouter extends RouterWithFile {
  private schema: Validation = new Validation(schema)
  private controller: Controller = new Controller()

  constructor(upload: Multer) {
    super(upload)
    this.register()
  }

  protected register(): void {
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
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
