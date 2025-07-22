import { Router } from 'express'
import {
  deletePayrollPeriod,
  getPayrollPeriod,
  getPayrollPeriods,
  getPayrollPeriodsInfinite,
  patchPayrollPeriod,
  postPayrollPeriod,
} from './controller'

const router = Router()

router.get('/data/infinite', getPayrollPeriodsInfinite)

router.get('/', getPayrollPeriods)
router.post('/', postPayrollPeriod)
router.get('/:id', getPayrollPeriod)
router.patch('/:id', patchPayrollPeriod)
router.delete('/:id', deletePayrollPeriod)

export default router
