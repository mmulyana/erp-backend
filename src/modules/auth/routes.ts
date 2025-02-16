import { Router } from 'express'
import { loginController } from './controller'

const router = Router()

router.get('/login', loginController)

export default router
