import RouterWithFile from '../../helper/router-with-file'
import { MulterConfig } from '../../utils/multer-config'
import Validation from '../../helper/validation'
import AccountController from './controller'
import {
  createAccountSchema,
  updateAccountSchema,
  updatePasswordSchema,
} from './schema'

export default class AccountRouter extends RouterWithFile {
  private controller: AccountController = new AccountController()

  private updatePassword: Validation = new Validation(updatePasswordSchema)
  private createSchema: Validation = new Validation(createAccountSchema)
  private updateSchema: Validation = new Validation(updateAccountSchema)

  constructor(multer: MulterConfig) {
    super(multer.uploadImg, 'akun')
    this.register()
  }

  protected register() {    
    this.router.post('/', this.createSchema.validate, this.controller.createAccountHandler)
    
    this.router.delete('/:id', this.controller.deleteAccountHandler)
    
    this.router.patch('/:id', this.upload.single('photo'), this.compressImage, this.updateSchema.validate, this.controller.updateAccountHandler)
    this.router.patch('/:id/role/add/:roleId', this.controller.updateRoleAccountHandler)
    this.router.patch('/:id/permission/add/:permissionId', this.controller.createPermissionHandler)
    this.router.patch('/:id/permission/remove/:permissionId', this.controller.createPermissionHandler)
    this.router.patch('/:id/password/update', this.updatePassword.validate, this.controller.updatePasswordHandler)
    this.router.patch('/:id/password/reset', this.controller.resetPasswordHandler)

    this.router.get('/:id', this.controller.getAccountHandler)
    this.router.get('/', this.controller.getAllAccountHandler)
  }
}
