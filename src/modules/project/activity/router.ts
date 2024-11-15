import RouterWithFile from '../../../helper/router-with-file'
import { MulterConfig } from '../../../utils/multer-config'
import Validation from '../../../helper/validation'
import ActivityController from './controller'
import { Server } from 'socket.io'
import {
  activitySchema,
  removeAttachmentSchema,
  updateActivitySchema,
} from './schema'

export default class ActivityRouter extends RouterWithFile {
  private controller: ActivityController
  private commentSchema: Validation = new Validation(activitySchema)
  private updateSchema: Validation = new Validation(updateActivitySchema)
  private removeAttachmentSchema: Validation = new Validation(
    removeAttachmentSchema
  )

  constructor(multer: MulterConfig, io: Server) {
    super(multer.uploadImg, 'activity')
    this.controller = new ActivityController(io)
    this.register()
  }

  protected register(): void {
    this.router.post('/', this.upload.array('photos', 5), this.handleMultipleImage, this.commentSchema.validate, this.controller.handleCreate)
    this.router.patch( '/:id', this.upload.array('photos', 5), this.handleMultipleImage, this.updateSchema.validate, this.controller.handleUpdate)
    this.router.delete('/:id', this.controller.handleDelete)
    this.router.get('/', this.controller.handleRead)
    
    
    this.router.post('/:id/upload/photo', this.upload.array('photos', 5), this.handleMultipleImage, this.controller.handleUploadAttachments)
    this.router.delete('/photo/remove', this.removeAttachmentSchema.validate, this.controller.handleRemoveAttachments)
    this.router.post('/toggle/like', this.controller.handleToggleLike)
  }
}
