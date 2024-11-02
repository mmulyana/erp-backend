import RouterWithFile from '../../../helper/router-with-file'
import { goodsSchema, updateGoodsSchema } from './schema'
import Validation from '../../../helper/validation'
import Controller from './controller'
import { Multer } from 'multer'

export default class GoodsRouter extends RouterWithFile {
  private schema: Validation = new Validation(goodsSchema)
  private updateSchema: Validation = new Validation(updateGoodsSchema)
  private controller: Controller = new Controller()

  constructor(upload: Multer) {
    super(upload, 'goods')
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
    this.router.get('/:id', this.controller.readOneHandler)
    this.router.get('/data/low-stock', this.controller.readLowStockHandler)
    this.router.get('/data/out-of-stock', this.controller.readOutOfStockHandler)
  }
}
