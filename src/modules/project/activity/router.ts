import RouterWithFile from '../../../helper/router-with-file'
import { MulterConfig } from '../../../utils/multer-config'
import Validation from '../../../helper/validation'
import ClientController from './controller'
import { activitySchema } from './schema'

export default class ActivityRouter extends RouterWithFile {
  private controller: ClientController = new ClientController()
  private commentSchema: Validation = new Validation(activitySchema)

  constructor(multer: MulterConfig) {
    super(multer.uploadImg, 'activity')
    this.register()
  }

  protected register() {
    this.router.post('/', this.commentSchema.validate, this.controller.handleCreate)
    this.router.patch('/:id', this.commentSchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)

    this.router.post('/toggle/like', this.controller.handleToggleLike)
    this.router.post('/:id/upload/photo', this.upload.array('photos', 5), this.handleMultipleImage, this.controller.handleUploadAttachment)
  }
}
