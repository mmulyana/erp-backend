import { Router } from 'express'
import { createRole, findRoles } from './controller'

const router = Router()

router.get('/', findRoles)
router.post('/', createRole)

export default router
// import { Router } from 'express'
// import Validation from '../../helper/validation'
// import { createRoleSchema, updateRoleSchema } from './schema'
// import RoleController from './controller'

// export default class RoleRouter {
//   public router: Router
//   private controller: RoleController = new RoleController()
//   private create: Validation = new Validation(createRoleSchema)
//   private update: Validation = new Validation(updateRoleSchema)

//   constructor() {
//     this.router = Router()
//     this.register()
//   }

//   protected register() {
//     this.router.get('/', this.controller.getRolesHandler)
//     this.router.get('/:id', this.controller.getRoleByIdHandler)

//     this.router.post('/', this.create.validate, this.controller.createRoleHandler)
//     this.router.post('/:id/permission/add/:permissionId', this.controller.addPermissionRoleHandler)

//     this.router.delete('/:id', this.controller.deleteRoleHandler)
//     this.router.delete('/:id/permission/remove/:permissionId', this.controller.deletePermissionRoleHandler)

//     this.router.patch('/:id', this.update.validate, this.controller.updateRoleHandler)
//   }
// }
