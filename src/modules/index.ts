import { Router } from 'express'

import userRoutes from './user/router'
import authRoutes from './auth/router'
import roleRoutes from './role/router'
import permissionRoutes from './permission/router'
import isAuthenticated from '@/middleware/is-authenticated'

const route = Router()

route.use('/auth', authRoutes)
route.use('/user', isAuthenticated, userRoutes)
route.use('/role', isAuthenticated, roleRoutes)
route.use('/permission', isAuthenticated, permissionRoutes)

export default route
