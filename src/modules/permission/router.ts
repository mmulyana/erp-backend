import { Router } from 'express'
import {
  deletePermission,
  getAllPermission,
  updatePermission,
  savePermission,
  getAllByGroup,
  deleteGroup,
  updateGroup,
  saveGroup,
} from './controller'

const router = Router()

router.get('/item/', getAllPermission)
router.post('/item', savePermission)
router.patch('/item/:id', updatePermission)
router.delete('/item/:id', deletePermission)

router.get('/grup', getAllByGroup)
router.post('/group', saveGroup)
router.patch('/group/:id', updateGroup)
router.delete('/group/:id', deleteGroup)

export default router
