import { Router } from 'express'

import userRoutes from './user/routes'
import authRoutes from './auth/routes'

const route = Router()

route.use('/user', userRoutes)
route.use('/auth', authRoutes)

export default route
