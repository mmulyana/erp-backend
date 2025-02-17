import { Router } from 'express'
import { createUser, findUsers } from './controller'

const router = Router()

router.get('/', findUsers)
router.post('/', createUser)
// router.patch('/:id')
// router.delete('/:id')

export default router
