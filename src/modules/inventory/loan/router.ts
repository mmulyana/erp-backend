import upload from '@/utils/upload'
import { Router } from 'express'
import {
  getLoan,
  getLoans,
  getStatusByMonth,
  patchLoan,
  patchReturnLoan,
  postLoan,
} from './controller'

const router = Router()

router.get('/data/status', getStatusByMonth)

router.get('/', getLoans)
router.get('/:id', getLoan)
router.post('/', upload.single('photoUrl'), postLoan)
router.patch('/:id', upload.single('photoUrlIn'), patchLoan)
router.patch('/:id/return', upload.single('photoUrlOut'), patchReturnLoan)

export default router
