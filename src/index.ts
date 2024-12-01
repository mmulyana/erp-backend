// index.ts
import express, { Express } from 'express'
import { ErrorHandler } from './helper/error-handler'
import { AuthMiddleware } from './middleware/auth-middleware'
import { createMulter, MulterConfig } from './utils/multer-config'
import { setupRoutes } from './routes'
import { Server } from 'socket.io'
import cors from 'cors'
import http from 'http'

import KanbanSocket from './modules/project/kanban/socket'
import ActivitySocket from './modules/project/activity/socket'

class Application {
  private app: Express
  private httpServer: http.Server
  private PORT: number
  private HOST: string
  private authMiddleware: AuthMiddleware = new AuthMiddleware()
  private multerConfig: MulterConfig
  private io: Server

  constructor() {
    this.app = express()
    this.httpServer = http.createServer(this.app)
    this.PORT = Number(process.env.REST_PORT) || 5000
    this.HOST = process.env.HOST || 'localhost'

    this.multerConfig = createMulter()
    this.io = new Server(this.httpServer, {
      cors: {
        origin: '*',
      },
    })

    this.plugin()
    this.setupSocket()
    this.setupRoutes()
    this.start()
  }

  private plugin(): void {
    this.app.use(cors())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(express.json())
    this.app.use(express.static('public'))
  }

  private setupRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({ message: 'hello world' })
    })

    const v1Router = express.Router()

    setupRoutes(v1Router, this.authMiddleware, {
      multerConfig: this.multerConfig,
      withoutAuth: false,
      io: this.io,
    })

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
      new KanbanSocket(socket, this.io).socket
      new ActivitySocket(socket, this.io).socket

      socket.on('disconnect', () => {
        console.log('User disconnected')
      })
    })
  }

  private start(): void {
    this.httpServer.listen(this.PORT, this.HOST, () => {
      console.log(`Server is running at http://${this.HOST}:${this.PORT}`)
    })
  }
}

new Application()
