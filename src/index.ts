import express from 'express'
import cors from 'cors'

import { errorHandler } from './utils/error-handler'
import Routes from './modules'

const PORT = Number(process.env.REST_PORT) || 5000
const HOST = process.env.HOST || 'localhost'

const app = express()

app.use(cors())
app.use(express.static('public'))
app.use(express.json())

app.post('/', (req, res) => {
  res.status(200).json({ message: 'Ok' })
})

const routes = Routes()
routes.forEach(({ path, router }) => {
  app.use(`/api/${path}`, router)
})

app.use(async (req, res, next) => {
  res.status(404).json({ message: 'Not found!' })
})

app.use(errorHandler)

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST}:${PORT}`)
})

export default app
