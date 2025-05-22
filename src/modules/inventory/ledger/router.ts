import { Router } from 'express'

import { getChart, getTable } from './controller'

const router = Router()

router.get('/chart', getChart)
router.get('/activity', getTable)

export default router
