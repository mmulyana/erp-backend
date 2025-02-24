import { Router } from 'express'
import {
  destroyOvertime,
  readOvertime,
  readOvertimes,
  saveOvertime,
  updateOvertime,
} from './controller'

const router = Router()
router.get('/', readOvertimes)
router.post('/', saveOvertime)
router.get('/:id', readOvertime)
router.patch('/:id', updateOvertime)
router.delete('/:id', destroyOvertime)

export default router
