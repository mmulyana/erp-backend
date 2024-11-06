import RouterWithFile from '../../helper/router-with-file'
import { MulterConfig } from '../../utils/multer-config'
import Validation from '../../helper/validation'
import AccountController from './controller'
import { createAccountSchema, updateAccountSchema } from './schema'

export default class AccountRouter extends RouterWithFile {
  private controller: AccountController = new AccountController()
  private create: Validation = new Validation(createAccountSchema)
  private update: Validation = new Validation(updateAccountSchema)

  constructor(multer: MulterConfig) {
    super(multer.uploadImg, 'Akun')
  }

  protected register() {
    this.router.get(
      '/:id',
      this.create.validate,
      this.controller.getAccountHandler
    )
    this.router.delete('/:id', this.controller.deleteAccountHandler)
    this.router.patch(
      '/:id',
      this.upload.single('photo'),
      this.compressImage,
      this.update.validate,
      this.controller.updateAccountHandler
    )
    this.router.post(
      '/',
      this.upload.single('photo'),
      this.create.validate,
      this.controller.createAccountHandler
    )
    this.router.patch(
      '/:id/role/add/:roleId',
      this.controller.updateRoleAccountHandler
    )
    this.router.patch(
      '/:id/permission/add/:permissionId',
      this.controller.createPermissionHandler
    )
    this.router.patch(
      '/:id/permission/remove/:permissionId',
      this.controller.createPermissionHandler
    )
  }
}
