import app from './src/index'
import { Server } from 'http'

let server: Server

beforeAll(() => {
  server = app.listen(5001)
})

afterAll(() => {
  server.close()
})
