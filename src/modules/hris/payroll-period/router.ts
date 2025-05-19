import { Router } from 'express'
import { getPeriod, getPeriods, postPeriod } from './controller'

const router = Router()

router.get('/', getPeriods)
router.get('/:id', getPeriod)
router.post('/', postPeriod)

export default router
