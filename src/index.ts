import express, { Express } from 'express'
import { ErrorHandler } from './helper/error-handler'
import { AuthMiddleware } from './middleware/auth-middleware'
import { setupRoutes } from './routes'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import KanbanSocket from './modules/project/kanban/socket'
import multer from 'multer'
import path from 'path'

class Application {
  private app: Express
  private HttpServer: http.Server
  private PORT: number
  private WS_PORT: number
  private HOST: string
  private authMiddleware: AuthMiddleware = new AuthMiddleware()
  private uploadImg: multer.Multer

  constructor() {
    this.app = express()
    this.HttpServer = http.createServer(this.app)
    this.PORT = Number(process.env.REST_PORT) || 5000
    this.WS_PORT = Number(process.env.WS_PORT) || 5001
    this.HOST = process.env.HOST || 'localhost'

    this.uploadImg = this.setupMulter()
    this.plugin()
    this.setupRoutes()
    this.setupSocket()
    this.start()
  }

  private setupMulter(): multer.Multer {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/img')
      },
      filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
      },
    })

    return multer({ storage: storage })
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
    setupRoutes(v1Router, this.authMiddleware, true, this.uploadImg)

    this.app.use('/api/v1', v1Router)

    // 404 handler
    this.app.use((req, res, next) => {
      next({ err: 'not found' })
    })

    // Error handler
    this.app.use(ErrorHandler)
  }

  private setupSocket(): Server {
    const io = new Server(this.HttpServer, {
      cors: {
        origin: '*',
      },
    })

    io.on('connection', (socket) => {
      console.log('New client connected')
      new KanbanSocket(socket, io).socket
    })

    io.on('disconnect', () => {
      console.log('User disconnected')
    })

    return io
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
