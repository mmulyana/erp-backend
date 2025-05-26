import { Router } from 'express'

import { getChart, getLedgers, getTable } from './controller'

const router = Router()

router.get('/chart', getChart)
router.get('/activity', getTable)

router.get('/', getLedgers)

export default router
