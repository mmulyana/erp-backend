import RouterWithFile from '../../../helper/router-with-file'
import Validation from '../../../helper/validation'
import ActivityController from './controller'

import { activitySchema, updateActivitySchema } from './schema'
import { MulterConfig } from '../../../utils/multer-config'
import { Server } from 'socket.io'

export default class ActivityRouter extends RouterWithFile {
  private controller: ActivityController
  private commentSchema: Validation = new Validation(activitySchema)
  private updateSchema: Validation = new Validation(updateActivitySchema)

  constructor(multer: MulterConfig, io: Server) {
    super(multer.uploadImg, 'activity')
    this.controller = new ActivityController(io)
    this.register()
  }

  protected register(): void {
    this.router.post(
      '/',
      this.upload.array('photos', 5),
      this.handleMultipleImage,
      this.commentSchema.validate,
      this.controller.handleCreate
    )
    this.router.patch(
      '/:id',
      this.upload.array('photos', 5),
      this.handleMultipleImage,
      this.updateSchema.validate,
      this.controller.handleUpdate
    )
    this.router.delete('/:id', this.controller.handleDelete)

    this.router.post('/toggle/like', this.controller.handleToggleLike)
  }
}
