import express, { Express } from 'express'
import cors from 'cors'
import { ErrorHandler } from './helper/error-handler'
import { AuthMiddleware } from './middleware/auth-middleware'

import AuthRoutes from './modules/auth/router'
import RolesRoutes from './modules/roles/router'
import PermissionRoutes from './modules/permission/router'
import RolesPermissionRoutes from './modules/roles-permission/router'
import AccountRouter from './modules/account/router'
import PermissionGroupRoutes from './modules/permission-group/router'
import userRole from './modules/user-role/router'

class Application {
  private app: Express
  private port: number
  private host: string
  private authMiddleware: AuthMiddleware = new AuthMiddleware()

  constructor() {
    this.app = express()
    this.port = Number(process.env.PORT) || 5000
    this.host = process.env.HOST || 'localhost'
    this.plugin()
    this.routers()
    this.start()
  }

  async routers() {
    this.app.get('/', (req, res, next) => {
      res.json({
        message: 'hello world',
      })
    })

    let v1 = express.Router()

    // authorization
    v1.use('/auth', new AuthRoutes().router)
    v1.use('/roles', this.authMiddleware.isAuthenticated, new RolesRoutes().router)
    v1.use('/permission', this.authMiddleware.isAuthenticated, new PermissionRoutes().router)
    v1.use('/rolePermission', this.authMiddleware.isAuthenticated, new RolesPermissionRoutes().router)
    v1.use('/account', this.authMiddleware.isAuthenticated, new AccountRouter().router)
    v1.use('/permission-group', this.authMiddleware.isAuthenticated, new PermissionGroupRoutes().router)
    v1.use('/user-role', this.authMiddleware.isAuthenticated, new userRole().router)

    this.app.use('/api/v1', v1)

    this.app.use((req, res, next) => {
      next({ err: 'not found' })
    })

    this.app.use(ErrorHandler)
  }

  plugin() {
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }

  start() {
    this.app.listen(this.port, this.host, () => {
      console.log(`server is running at http://${this.host}:${this.port}`)
    })
  }
}

new Application()
