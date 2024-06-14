import express, { Express } from 'express'
import cors from 'cors'

class Application {
  private app: Express
  private port: number
  private host: string

  constructor() {
    this.app = express()
    this.port = Number(process.env.PORT) || 5000
    this.host = process.env.HOST || 'localhost'
    this.routers()
    this.start()
  }

  async routers() {
    this.app.get('/', (req, res, next) => {
      res.json({
        message: 'hello world',
      })
    })
  }

  start() {
    this.app.listen(this.port, this.host, () => {
      console.log(`server is running at http://${this.host}:${this.port}`)
    })
  }
}

new Application()
