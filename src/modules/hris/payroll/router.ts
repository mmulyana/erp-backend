import { Router } from 'express'
import { getPayrolls } from './controller'

const router = Router()

router.get('/', getPayrolls)

export default router
