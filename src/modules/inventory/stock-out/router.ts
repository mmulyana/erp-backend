import { Router } from 'express'
import upload from '@/utils/upload'
import {
  getStockOut,
  getStockOuts,
  getTotalByMonth,
  postStockOut,
} from './controller'

const router = Router()

router.get('/report/per-month', getTotalByMonth)

router.post('/', upload.single('photoUrl'), postStockOut)
router.get('/', getStockOuts)
router.get('/:id', getStockOut)

export default router
