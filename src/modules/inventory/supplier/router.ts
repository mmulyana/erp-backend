import { Router } from 'express'
import upload from '@/utils/upload'
import {
  deleteSupplier,
  getSupplier,
  getSuppliers,
  getSuppliersInfinite,
  getTotal,
  patchSupplier,
  postSupplier,
} from './controller'

const router = Router()

router.get('/data/infinite', getSuppliersInfinite)
router.get('/data/total', getTotal)

router.get('/', getSuppliers)
router.get('/:id', getSupplier)
router.patch('/:id', upload.single('photoUrl'), patchSupplier)
router.post('/', upload.single('photoUrl'), postSupplier)
router.delete('/:id', deleteSupplier)

export default router
