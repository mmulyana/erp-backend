import { Router } from 'express'
import {
  // getTotalInYear,
  readCashAdvance,
  readCashAdvances,
  saveCashAdvance,
  updateCashAdvance,
  destroyCashAdvance,
  getTotalInYear,
  getTotalInMonth,
  getTotalInDay,
  getReportInLastSixMonths,
} from './controller'

const router = Router()

router.get('/report/year', getTotalInYear)
router.get('/report/month', getTotalInMonth)
router.get('/report/day', getTotalInDay)
router.get('/report/six-month', getReportInLastSixMonths)
// router.get('/data/total', getTotalInYear)

router.get('/', readCashAdvances)
router.post('/', saveCashAdvance)
router.get('/:id', readCashAdvance)
router.patch('/:id', updateCashAdvance)
router.delete('/:id', destroyCashAdvance)

export default router
