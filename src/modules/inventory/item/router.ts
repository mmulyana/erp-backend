import { Router } from 'express'
import {
  deleteInventory,
  getInventories,
  getInventory,
  patchInventory,
  postInventory,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/data/infinite')
router.get('/', getInventories)
router.get('/:id', getInventory)
router.patch('/:id', upload.single('photoUrl'), patchInventory)
router.post('/', upload.single('photoUrl'), postInventory)
router.delete('/:id', deleteInventory)

export default router
