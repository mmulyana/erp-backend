import RouterWithFile from '../../../helper/router-with-file'
import Validation from '../../../helper/validation'
import { brandSchema } from './schema'
import BrandController from './controller'
import multer from 'multer'

export default class BrandRouter extends RouterWithFile {
  private schema: Validation = new Validation(brandSchema)
  private controller: BrandController = new BrandController()

  constructor(upload: multer.Multer) {
    super(upload, 'brand')
    this.register()
  }

  protected register() {
    this.router.post('/', this.upload.single('photo'), this.compressImage, this.schema.validate, this.controller.createHandler)
    this.router.patch('/:id', this.upload.single('photo'), this.compressImage, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
    this.router.get('/:id', this.controller.readOneHandler)
  }
}
