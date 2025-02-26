import { Router } from 'express'
import {
  destroyRecapitulation,
  exportReportRecapitulation,
  readRecapitulation,
  readRecapitulations,
  readReportRecapitulation,
  saveRecapitulation,
  updateRecapitulation,
} from './controller'

const router = Router()

router.post('/', saveRecapitulation)
router.get('/', readRecapitulations)
router.get('/:id', readRecapitulation)
router.patch('/:id', updateRecapitulation)
router.delete('/:id', destroyRecapitulation)
router.get('/:id/report', readReportRecapitulation)
router.get('/:id/report/export', exportReportRecapitulation)

export default router
