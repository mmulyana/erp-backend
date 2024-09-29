import { Router } from 'express'
import { AuthMiddleware } from './middleware/auth-middleware'
import multer from 'multer'

import AuthRoutes from './modules/auth/router'
import AccountRouter from './modules/account/router'
import RolesRoutes from './modules/roles-permissions/roles/router'
import UserRoleRoutes from './modules/roles-permissions/user-role/router'
import PermissionRoutes from './modules/roles-permissions/permission/router'
import PermissionGroupRoutes from './modules/roles-permissions/permission-group/router'
import ActiviyLogRouter from './modules/log/router'

// HRIS
import PositionRoutes from './modules/hris/position/router'
import EmployeeRoutes from './modules/hris/employee/router'
import LeaveRoutes from './modules/hris/leave/router'
import AttendanceRoutes from './modules/hris/attendance/router'
import OvertimeRoutes from './modules/hris/overtime/router'
import CashAdvanceRoutes from './modules/hris/cash-advance/router'
import CompetencyRoutes from './modules/hris/competency/router'

// PROJECT
import ProjectRoutes from './modules/project/index/router'
import ClientRoutes from './modules/project/client/router'
import LabelRoutes from './modules/project/label/router'
import CompanyRoutes from './modules/project/company/router'
import BoardRoutes from './modules/project/board/router'
import CommentRoutes from './modules/project/comment/router'

// INVENTORY
import BrandRoutes from './modules/inventory/brand/router'
import CategoryRoutes from './modules/inventory/category/router'
import EmployeeSupplierRoutes from './modules/inventory/employee-supplier/router'
import SupplierRoutes from './modules/inventory/supplier/router'
import LocationRoutes from './modules/inventory/location/router'
import MeasurementRoutes from './modules/inventory/measurement/router'
import TagRoutes from './modules/inventory/tags/router'
import GoodsRoutes from './modules/inventory/goods/router'
import TransactionRoutes from './modules/inventory/transaction/router'

interface RouteConfig {
  path: string
  router: Router
  auth?: boolean
}

export function setupRoutes(
  app: Router,
  authMiddleware: AuthMiddleware,
  withoutAuth: boolean = false,
  uploadImg: multer.Multer
): void {

  const routes: RouteConfig[] = [
    // COMMON
    { path: '/auth', router: new AuthRoutes().router },
    { path: '/roles', router: new RolesRoutes().router, auth: true },
    { path: '/user-role', router: new UserRoleRoutes().router, auth: true },
    { path: '/account', router: new AccountRouter().router, auth: true },
    { path: '/permission', router: new PermissionRoutes().router, auth: true },
    { path: '/permission-group', router: new PermissionGroupRoutes().router, auth: true },
    { path: '/log', router: new ActiviyLogRouter().router },
    
    // HRIS
    { path: '/hris/position', router: new PositionRoutes().router, auth: true },
    { path: '/hris/employee', router: new EmployeeRoutes().router, auth: true },
    { path: '/hris/leave', router: new LeaveRoutes().router, auth: true },
    { path: '/hris/attendance', router: new AttendanceRoutes().router, auth: true },
    { path: '/hris/cash-advance', router: new CashAdvanceRoutes().router, auth: true },
    { path: '/hris/competency', router: new CompetencyRoutes().router, auth: true },
    { path: '/hris/overtime', router: new OvertimeRoutes().router, auth: true },
    
    // PROJECT
    { path: '/project', router: new ProjectRoutes().router, auth: true },
    { path: '/project/client', router: new ClientRoutes().router, auth: true },
    { path: '/project/label', router: new LabelRoutes().router, auth: true },
    { path: '/project/company', router: new CompanyRoutes().router, auth: true },
    { path: '/project/board', router: new BoardRoutes().router, auth: true },
    { path: '/project/comment', router: new CommentRoutes().router, auth: true },
    
    // INVENTORY
    { path: '/inventory/brand', router: new BrandRoutes(uploadImg).router, auth: true },
    { path: '/inventory/category', router: new CategoryRoutes().router, auth: true },
    { path: '/inventory/supplier', router: new SupplierRoutes(uploadImg).router, auth: true },
    { path: '/inventory/supplier/employee', router: new EmployeeSupplierRoutes().router, auth: true },
    { path: '/inventory/location', router: new LocationRoutes().router, auth: true },
    { path: '/inventory/measurement', router: new MeasurementRoutes().router, auth: true },
    { path: '/inventory/tag', router: new TagRoutes().router, auth: true },
    { path: '/inventory/goods', router: new GoodsRoutes(uploadImg).router, auth: true },
    { path: '/inventory/transaction', router: new TransactionRoutes(uploadImg).router, auth: true },
  ]

  routes.forEach(({ path, router, auth }) => {
    if (auth && !withoutAuth) {
      app.use(path, authMiddleware.isAuthenticated, router)
    } else {
      app.use(path, router)
    }
  })
}
