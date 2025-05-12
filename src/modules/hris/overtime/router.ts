import { Router } from 'express'
import {
  deleteOvertime,
  getOvertimeChart,
  getOvertime,
  getOvertimes,
  postOvertime,
  patchOvertime,
  getOvertimeByDate,
} from './controller'

const router = Router()

router.get('/report/chart', getOvertimeChart)
router.get('/report/by-date', getOvertimeByDate)

router.get('/', getOvertimes)
router.post('/', postOvertime)
router.get('/:id', getOvertime)
router.patch('/:id', patchOvertime)
router.delete('/:id', deleteOvertime)

export default router
