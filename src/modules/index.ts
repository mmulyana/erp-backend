import { Router } from 'express'

import userRoutes from './user/router'
import authRoutes from './auth/router'
import roleRoutes from './role/router'

const route = Router()

route.use('/user', userRoutes)
route.use('/auth', authRoutes)
route.use('/role', roleRoutes)

export default route
