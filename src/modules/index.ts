import { Router } from 'express'

import isAuthenticated from '@/middleware/is-authenticated'

import userRoutes from './user/router'
import authRoutes from './auth/router'
import roleRoutes from './role/router'
import permissionRoutes from './permission/router'
import positionRoutes from './hris/position/router'
import employeeRoutes from './hris/employee/router'

const route = Router()

route.use('/auth', authRoutes)
route.use('/user', isAuthenticated, userRoutes)
route.use('/role', isAuthenticated, roleRoutes)
route.use('/permission', isAuthenticated, permissionRoutes)
route.use('/position', isAuthenticated, positionRoutes)
route.use('/employee', isAuthenticated, employeeRoutes)

export default route
