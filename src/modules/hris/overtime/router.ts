import { Router } from 'express'
import {
  destroyOvertime,
  readOvertime,
  readOvertimes,
  readTotalPerDay,
  saveOvertime,
  updateOvertime,
} from './controller'

const router = Router()

router.get('/data/total-per-day', readTotalPerDay)
router.get('/', readOvertimes)
router.post('/', saveOvertime)
router.get('/:id', readOvertime)
router.patch('/:id', updateOvertime)
router.delete('/:id', destroyOvertime)

export default router
