import { Router } from 'express'
import {
  readBoardChart,
  readBoards,
  saveBoard,
  updateBoard,
  destroyBoard,
} from './controller'

const router = Router()

router.get('/', readBoards)
router.post('/', saveBoard)
router.patch('/:id', updateBoard)
router.delete('/:id', destroyBoard)

router.get('/data/chart', readBoardChart)

export default router
