import upload from '@/utils/upload'
import { Router } from 'express'
import {
  getLoan,
  getLoans,
  getStatusByMonth,
  patchLoan,
  postLoan,
} from './controller'

const router = Router()

router.get('/data/status', getStatusByMonth)

router.get('/', getLoans)
router.get('/:id', getLoan)
router.post('/', upload.single('photoUrl'), postLoan)
router.patch('/:id', upload.single('photoUrlIn'), patchLoan)

export default router
