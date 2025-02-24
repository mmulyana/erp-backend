import { Router } from 'express'
import {
  destroyAttendance,
  readAttendances,
  saveAttendance,
  updateAttendance,
} from './controller'

const router = Router()

router.get('/', readAttendances)
router.post('/', saveAttendance)
router.patch('/:id', updateAttendance)
router.delete('/:id', destroyAttendance)

export default router
