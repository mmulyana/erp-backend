import 'module-alias/register'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { errorHandler } from './utils/error-handler'
import setupSwagger from './lib/swagger'
import Routes from './modules'
import route from './modules'

dotenv.config()

const PORT = Number(process.env.REST_PORT) || 5000
const HOST = process.env.HOST || 'localhost'

const app = express()

app.use(cors())
app.use(express.static('public'))
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

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})

export default app
