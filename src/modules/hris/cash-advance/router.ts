import { Router } from 'express'
import {
  getCashAdvance,
  getCashAdvances,
  postCashAdvance,
  patchCashAdvance,
  deleteCashAdvance,
  postCashAdvanceTransaction,
  patchCashAdvanceTransaction,
  deleteCashAdvanceTransaction,
  getCashAdvanceTransaction,
  getCashAdvanceTransactions,
  getTotalByMonth,
} from './controller'

const router = Router()

router.get('/report/by-month', getTotalByMonth)

router.post('/transaction', postCashAdvanceTransaction)
router.patch('/transaction/:id', patchCashAdvanceTransaction)
router.delete('/transaction/:id', deleteCashAdvanceTransaction)
router.get('/transaction', getCashAdvanceTransactions)
router.get('/transaction/:id', getCashAdvanceTransaction)

router.get('/', getCashAdvances)
router.post('/', postCashAdvance)
router.get('/:id', getCashAdvance)
router.patch('/:id', patchCashAdvance)
router.delete('/:id', deleteCashAdvance)

export default router
