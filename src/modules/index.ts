import { Router } from 'express'

import isAuthenticated from '@/middleware/is-authenticated'

import userRoutes from './user/router'
import authRoutes from './auth/router'
import roleRoutes from './role/router'
import permissionRoutes from './permission/router'
import accountRoutes from './account/router'

import employeeRoutes from './hris/employee/router'
import overtimeRoutes from './hris/overtime/router'
import attendanceRoutes from './hris/attendance/router'
import cashadvanceRoutes from './hris/cash-advance/router'
import periodRoutes from './hris/payroll-period/router'
import payrollRoutes from './hris/payroll/router'

import dashboardHrisRoutes from './hris/dashboard/router'

import itemRoutes from './inventory/item/router'
import warehouseRoutes from './inventory/warehouse/router'
import brandRoutes from './inventory/brand/router'
import supplierRoutes from './inventory/supplier/router'
import stockInRoutes from './inventory/stock-in/router'
import stockOutRoutes from './inventory/stock-out/router'
import ledgerRoutes from './inventory/ledger/router'
import loanRoutes from './inventory/loan/router'

import projectRoutes from './project/project/router'
import clientRoutes from './project/client/router'
import companyClientRoutes from './project/company/router'

const route = Router()

route.use('/auth', authRoutes)
route.use('/user', isAuthenticated, userRoutes)
route.use('/account', isAuthenticated, accountRoutes)
route.use('/role', isAuthenticated, roleRoutes)
route.use('/permission', isAuthenticated, permissionRoutes)

route.use('/employee', isAuthenticated, employeeRoutes)
route.use('/overtime', isAuthenticated, overtimeRoutes)
route.use('/attendance', isAuthenticated, attendanceRoutes)
route.use('/cash-advance', isAuthenticated, cashadvanceRoutes)
route.use('/payroll-period', isAuthenticated, periodRoutes)
route.use('/payroll', isAuthenticated, payrollRoutes)

route.use('/dashboard/hris', isAuthenticated, dashboardHrisRoutes)

route.use('/item', isAuthenticated, itemRoutes)
route.use('/warehouse', isAuthenticated, warehouseRoutes)
route.use('/brand', isAuthenticated, brandRoutes)
route.use('/supplier', isAuthenticated, supplierRoutes)
route.use('/stock-in', isAuthenticated, stockInRoutes)
route.use('/stock-out', isAuthenticated, stockOutRoutes)
route.use('/ledger', isAuthenticated, ledgerRoutes)
route.use('/loan', isAuthenticated, loanRoutes)

route.use('/project', isAuthenticated, projectRoutes)
route.use('/client', isAuthenticated, clientRoutes)
route.use('/company-client', isAuthenticated, companyClientRoutes)

export default route
