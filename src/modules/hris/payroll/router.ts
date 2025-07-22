import { Router } from 'express'
import {
  getPayroll,
  getPayrolls,
  getProgressByPeriodId,
  getTotalAmount,
  patchPayroll,
} from './controller'

const router = Router()

router.get('/report/total', getTotalAmount)
router.get('/report/progress/:id', getProgressByPeriodId)

router.get('/', getPayrolls)
router.get('/:id', getPayroll)
router.patch('/:id', patchPayroll)

export default router
