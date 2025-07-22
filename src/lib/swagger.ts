import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.1',
      description: 'API Documentation for ERP BJS',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'],
}

const swaggerSpec = swaggerJsdoc(options)

const setupSwagger = (app: Express): void => {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

export default setupSwagger
