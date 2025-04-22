import { Router } from 'express'
import { readBoards, saveBoard, updateBoard, destroyBoard } from './controller'

const router = Router()

router.get('/', readBoards)
router.post('/', saveBoard)
router.patch('/:id', updateBoard)
router.delete('/:id', destroyBoard)

export default router
