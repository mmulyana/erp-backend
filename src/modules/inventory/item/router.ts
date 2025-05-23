import { Router } from 'express'
import {
  deleteInventory,
  getInventories,
  getInventoriesInfinite,
  getInventory,
  getLowStock,
  getStatusChart,
  getSupplierById,
  getTotal,
  patchInventory,
  postInventory,
} from './controller'
import upload from '@/utils/upload'

const router = Router()

router.get('/data/infinite', getInventoriesInfinite)
router.get('/data/status', getStatusChart)
router.get('/data/low-stock', getLowStock)
router.get('/data/total', getTotal)

router.get('/', getInventories)
router.get('/:id', getInventory)
router.patch('/:id', upload.single('photoUrl'), patchInventory)
router.post('/', upload.single('photoUrl'), postInventory)
router.get('/:id/supplier', getSupplierById)
router.delete('/:id', deleteInventory)

export default router
