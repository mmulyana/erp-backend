import RouterWithFile from '../../../helper/router-with-file'
import Validation from '../../../helper/validation'
import Controller from './controller'
import { schema, updateSchema } from './schema'
import { Multer } from 'multer'

export default class TransactionRouter extends RouterWithFile {
  private create: Validation = new Validation(schema)
  private update: Validation = new Validation(updateSchema)
  
  private controller: Controller = new Controller()

  constructor(upload: Multer) {
    super(upload, 'transactions')
    this.register()
  }

  protected register(): void {
    this.router.post('/', this.create.validate, this.controller.createHandler)
    this.router.patch('/:id', this.update.validate, this.controller.updateHandler)
    this.router.delete('/:id', this.controller.deleteHandler)
    this.router.get('/', this.controller.readHandler)
    this.router.get('/:id', this.controller.readOneHandler)
    this.router.get('/data/borrowed', this.controller.readBorrowedGoodsHandler)
  }
}
