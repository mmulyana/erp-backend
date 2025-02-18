import { Router } from 'express'
import {
  createPermissionRole,
  deletePermissionRole,
  createRole,
  deleteRole,
  updateRole,
  findRoles,
  findRole,
} from './controller'

const router = Router()

router.get('/', findRoles)
router.get('/:id', findRole)
router.post('/', createRole)
router.patch('/:id', updateRole)
router.delete('/:id', deleteRole)
router.post('/:id/permission', createPermissionRole)
router.delete('/permission/:id', deletePermissionRole)

export default router
