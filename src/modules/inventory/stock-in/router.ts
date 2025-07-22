import upload from '@/utils/upload'
import { Router } from 'express'
import {
  getStockIn,
  getStockIns,
  getTotalByMonth,
  patchStockIn,
  postStockIn,
} from './controller'

const router = Router()

router.get('/report/per-month', getTotalByMonth)

router.post('/', upload.single('photoUrl'), postStockIn)
router.patch('/:id', upload.single('photoUrl'), patchStockIn)
router.get('/', getStockIns)
router.get('/:id', getStockIn)

export default router
