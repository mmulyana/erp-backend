import { Router } from 'express'
import {
  getPayrollPeriod,
  getPayrollPeriods,
  getPayrollPeriodsInfinite,
  postPayrollPeriod,
} from './controller'

const router = Router()

router.get('/data/infinite', getPayrollPeriodsInfinite)

router.get('/', getPayrollPeriods)
router.post('/', postPayrollPeriod)
router.get('/:id', getPayrollPeriod)

export default router
