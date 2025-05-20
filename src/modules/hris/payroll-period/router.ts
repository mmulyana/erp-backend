import { Router } from 'express'
import {
  getPayrollPeriod,
  getPayrollPeriods,
  postPayrollPeriod,
} from './controller'

const router = Router()

router.get('/', getPayrollPeriods)
router.post('/', postPayrollPeriod)
router.get('/:id', getPayrollPeriod)

export default router
