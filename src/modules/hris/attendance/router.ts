import { Router } from 'express'
import {
  getAttendanceByDate,
  getAttendanceChart,
  getAttendanceTotal,
  // destroyAttendance,
  readAttendances,
  saveAttendance,
  updateAttendance,
} from './controller'

const router = Router()

router.get('/report/chart', getAttendanceChart)
router.get('/report/all', getAttendanceTotal)
router.get('/report/by-date', getAttendanceByDate)

router.get('/', readAttendances)
router.post('/', saveAttendance)
router.patch('/', updateAttendance)
// router.delete('/:id', destroyAttendance)

export default router
