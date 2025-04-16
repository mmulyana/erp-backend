import { Router } from 'express'
import {
  getTotal,
  getTotalInYear,
  readCashAdvance,
  readCashAdvances,
  saveCashAdvance,
  updateCashAdvance,
  destroyCashAdvance,
} from './controller'

const router = Router()

router.get('/', readCashAdvances)
router.post('/', saveCashAdvance)
router.get('/:id', readCashAdvance)
router.patch('/:id', updateCashAdvance)
router.delete('/:id', destroyCashAdvance)

router.get('/data/total-by-month', getTotal)
router.get('/data/total', getTotalInYear)

export default router
