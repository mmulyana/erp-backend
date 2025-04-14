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

import projectRoutes from './project/project/router'
import clientRoutes from './project/client/router'
import companyClientRoutes from './project/company/router'
import boardRoutes from './project/board/router'

const route = Router()

route.use('/auth', authRoutes)
route.use('/user', isAuthenticated, userRoutes)
route.use('/role', isAuthenticated, roleRoutes)
route.use('/permission', isAuthenticated, permissionRoutes)

route.use('/employee', employeeRoutes)
route.use('/overtime', isAuthenticated, overtimeRoutes)
route.use('/attendance', isAuthenticated, attendanceRoutes)
route.use('/cash-advance', isAuthenticated, cashadvanceRoutes)

route.use('/project', isAuthenticated, projectRoutes)
route.use('/client', isAuthenticated, clientRoutes)
route.use('/company-client', isAuthenticated, companyClientRoutes)
route.use('/board', isAuthenticated, boardRoutes)

export default route
