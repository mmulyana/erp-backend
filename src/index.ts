import 'module-alias/register'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

import { commentSocketHandler } from './modules/project/comment'
import { errorHandler } from './utils/error-handler'
import setupSwagger from './lib/swagger'
import route from './modules'

dotenv.config()

const PORT = Number(process.env.REST_PORT) || 8000
const HOST = process.env.HOST || 'localhost'

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  console.log('client connected:', socket.id)

  commentSocketHandler(socket)

  socket.on('disconnect', () => {
    console.log('client disconnected:', socket.id)
  })
})

app.use(cors())
app.use(express.static('public'))
app.use(express.static('uploads'))
app.use(express.json())

app.post('/', (req, res) => {
  res.status(200).json({ message: 'Ok' })
})

app.use('/api', route)
setupSwagger(app)

app.use(async (req, res, next) => {
  res.status(404).json({ message: 'Not found!' })
})

app.use(errorHandler)

server.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})

export default app
