import { Router } from 'express'
import {
  // destroyAttendance,
  readAttendances,
  readTotalPerDay,
  saveAttendance,
  updateAttendance,
} from './controller'

const router = Router()

router.get('/', readAttendances)
router.post('/', saveAttendance)
router.patch('/', updateAttendance)
router.get('/total-per-day', readTotalPerDay)
// router.delete('/:id', destroyAttendance)

export default router
