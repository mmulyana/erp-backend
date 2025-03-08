import { Router } from 'express'

const router = Router()

router.get('/')
router.post('/')
router.patch('/:id')
router.delete('/:id')

router.get('/data/chart')

export default router
