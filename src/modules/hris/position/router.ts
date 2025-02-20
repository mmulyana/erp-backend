import { Router } from 'express'
import {
  destroyPosition,
  getPosition,
  getPositions,
  getTotalByPosition,
  getTotalByStatus,
  savePosition,
  updatePosition,
} from './controller'

const router = Router()

router.get('/', getPositions)
router.get('/:id', getPosition)
router.post('/', savePosition)
router.patch('/:id', updatePosition)
router.delete('/:id', destroyPosition)
router.get('/data/employee-by-position', getTotalByPosition)
router.get('/data/employee-by-status', getTotalByStatus)

export default router
