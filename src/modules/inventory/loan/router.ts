import upload from '@/utils/upload'
import { Router } from 'express'
import { getLoans, getStatusByMonth, postLoan } from './controller'

const router = Router()

router.get('/data/status', getStatusByMonth)

router.get('/', getLoans)
router.post('/', upload.array('photoUrl', 10), postLoan)

export default router
