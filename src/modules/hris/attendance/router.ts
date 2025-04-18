import { Router } from 'express'
import {
  getReportAttendances,
  // destroyAttendance,
  readAttendances,
  readTotalPerDay,
  saveAttendance,
  updateAttendance,
} from './controller'

const router = Router()

router.get('/total-per-day', readTotalPerDay)
router.get('/report', getReportAttendances)

router.get('/', readAttendances)
router.post('/', saveAttendance)
router.patch('/', updateAttendance)
// router.delete('/:id', destroyAttendance)

export default router
