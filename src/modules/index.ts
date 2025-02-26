import { Router } from 'express'

import isAuthenticated from '@/middleware/is-authenticated'

import userRoutes from './user/router'
import authRoutes from './auth/router'
import roleRoutes from './role/router'
import permissionRoutes from './permission/router'

import positionRoutes from './hris/position/router'
import employeeRoutes from './hris/employee/router'
import overtimeRoutes from './hris/overtime/router'
import attendanceRoutes from './hris/attendance/router'
import competencyRoutes from './hris/competency/router'
import cashadvanceRoutes from './hris/cash-advance/router'
import recapitulationRoutes from './hris/recapitulation/router'

const route = Router()

route.use('/auth', authRoutes)
route.use('/user', isAuthenticated, userRoutes)
route.use('/role', isAuthenticated, roleRoutes)
route.use('/permission', isAuthenticated, permissionRoutes)
route.use('/position', isAuthenticated, positionRoutes)
route.use('/employee', isAuthenticated, employeeRoutes)
route.use('/overtime', isAuthenticated, overtimeRoutes)
route.use('/attendance', isAuthenticated, attendanceRoutes)
route.use('/cash-advance', isAuthenticated, cashadvanceRoutes)
route.use('/competency', isAuthenticated, competencyRoutes)
route.use('/recapitulation', isAuthenticated, recapitulationRoutes)

export default route
