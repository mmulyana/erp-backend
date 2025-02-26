import { Router } from 'express'

import isAuthenticated from '@/middleware/is-authenticated'

import userRoutes from './user/router'
import authRoutes from './auth/router'
import roleRoutes from './role/router'
import permissionRoutes from './permission/router'

import employeeRoutes from './hris/employee/router'
import overtimeRoutes from './hris/overtime/router'
import attendanceRoutes from './hris/attendance/router'
import cashadvanceRoutes from './hris/cash-advance/router'

const route = Router()

route.use('/auth', authRoutes)
route.use('/user', isAuthenticated, userRoutes)
route.use('/role', isAuthenticated, roleRoutes)
route.use('/permission', isAuthenticated, permissionRoutes)
route.use('/employee', isAuthenticated, employeeRoutes)
route.use('/overtime', isAuthenticated, overtimeRoutes)
route.use('/attendance', isAuthenticated, attendanceRoutes)
route.use('/cash-advance', isAuthenticated, cashadvanceRoutes)

export default route
