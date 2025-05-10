import { Router } from 'express'
import {
  deleteOvertime,
  getOvertimeChart,
  getOvertime,
  getOvertimes,
  postOvertime,
  patchOvertime,
} from './controller'

const router = Router()

router.get('/report/chart', getOvertimeChart)

router.get('/', getOvertimes)
router.post('/', postOvertime)
router.get('/:id', getOvertime)
router.patch('/:id', patchOvertime)
router.delete('/:id', deleteOvertime)

export default router
