import express, { Express } from 'express'
import { ErrorHandler } from './helper/error-handler'
import { AuthMiddleware } from './middleware/auth-middleware'
import { setupRoutes } from './routes'
import cors from 'cors'

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
    this.setupRoutes()
    this.start()
  }

  private plugin(): void {
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
  }

  private setupRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({ message: 'hello world' })
    })

    const v1Router = express.Router()
    setupRoutes(v1Router, this.authMiddleware)

    this.app.use('/api/v1', v1Router)

    // 404 handler
    this.app.use((req, res, next) => {
      next({ err: 'not found' })
    })

    // Error handler
    this.app.use(ErrorHandler)
  }

  private start(): void {
    this.app.listen(this.port, this.host, () => {
      console.log(`server is running at http://${this.host}:${this.port}`)
    })
  }
}

new Application()
