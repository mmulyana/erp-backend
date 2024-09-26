import { Multer } from 'multer'
import RouterWithFile from '../../../helper/router-with-file'
import Validation from '../../../helper/validation'
import { goodsSchema, updateGoodsSchema } from './schema'
import Controller from './controller'

export default class GoodsRouter extends RouterWithFile {
  private schema: Validation = new Validation(goodsSchema)
  private updateSchema: Validation = new Validation(updateGoodsSchema)
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
      this.updateSchema.validate,
      this.controller.updateHandler
    )
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
  }
}
