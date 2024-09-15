import express, { Express } from 'express'
import { ErrorHandler } from './helper/error-handler'
import { AuthMiddleware } from './middleware/auth-middleware'
import { setupRoutes } from './routes'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import KanbanSocket from './modules/project/kanban/socket'

class Application {
  private app: Express
  private HttpServer: http.Server
  private PORT: number
  private WS_PORT: number
  private HOST: string
  private authMiddleware: AuthMiddleware = new AuthMiddleware()
  private io: Server

  constructor() {
    this.app = express()
    this.HttpServer = http.createServer()
    this.PORT = Number(process.env.REST_PORT) || 5000
    this.WS_PORT = Number(process.env.WS_PORT) || 5001
    this.HOST = process.env.HOST || 'localhost'
    this.plugin()
    this.setupRoutes()
    this.io = new Server(this.HttpServer, {
      cors: {
        origin: '*',
      },
    })
    this.setupSocket()
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
    setupRoutes(v1Router, this.authMiddleware, true)

    this.app.use('/api/v1', v1Router)

    // 404 handler
    this.app.use((req, res, next) => {
      next({ err: 'not found' })
    })

    // Error handler
    this.app.use(ErrorHandler)
  }

  private setupSocket(): void {
    this.io.on('connection', (socket) => {
      console.log('New client connected')
      new KanbanSocket(socket)
    })
  }

  private start(): void {
    // API server
    this.app.listen(this.PORT, this.HOST, () => {
      console.log(`API server is running at http://${this.HOST}:${this.PORT}`)
    })

    // WebSocket server
    this.HttpServer.listen(this.WS_PORT, () => {
      console.log(
        `WebSocket server is running at ws://${this.HOST}:${this.WS_PORT}`
      )
    })
  }
}

new Application()
