import { Router } from 'express'
import { AuthMiddleware } from './middleware/auth-middleware'

import AuthRoutes from './modules/auth/router'
import AccountRouter from './modules/account/router'
import RolesRoutes from './modules/roles-permissions/roles/router'
import UserRoleRoutes from './modules/roles-permissions/user-role/router'
import PermissionRoutes from './modules/roles-permissions/permission/router'
import PermissionGroupRoutes from './modules/roles-permissions/permission-group/router'

import PositionRoutes from './modules/human-resources/position/router'
import EmployeeRoutes from './modules/human-resources/employee/router'
import LeaveRoutes from './modules/human-resources/leave/router'

interface RouteConfig {
  path: string
  router: Router
  auth?: boolean
}

export function setupRoutes(
  app: Router,
  authMiddleware: AuthMiddleware,
  withoutAuth: boolean = false
): void {
  const routes: RouteConfig[] = [
    { path: '/auth', router: new AuthRoutes().router },
    { path: '/roles', router: new RolesRoutes().router, auth: true },
    { path: '/user-role', router: new UserRoleRoutes().router, auth: true },
    { path: '/account', router: new AccountRouter().router, auth: true },
    { path: '/permission', router: new PermissionRoutes().router, auth: true },
    { path: '/permission-group', router: new PermissionGroupRoutes().router, auth: true },
    { path: '/hris/position', router: new PositionRoutes().router, auth: true },
    { path: '/hris/employee', router: new EmployeeRoutes().router, auth: true },
    { path: '/hris/leave', router: new LeaveRoutes().router, auth: true }
  ]

  routes.forEach(({ path, router, auth }) => {
    if (auth && !withoutAuth) {
      app.use(path, authMiddleware.isAuthenticated, router)
    } else {
      app.use(path, router)
    }
  })
}
