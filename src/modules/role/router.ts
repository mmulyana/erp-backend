import { Router } from 'express'
import {
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

export default router
