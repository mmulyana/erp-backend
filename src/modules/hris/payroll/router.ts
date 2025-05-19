import { Router } from 'express'
import { getPayroll, getPayrolls, patchPayroll } from './controller'

const router = Router()

router.get('/', getPayrolls)
router.get('/:id', getPayroll)
router.patch('/:id', patchPayroll)

export default router
