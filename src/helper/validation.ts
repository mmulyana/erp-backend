import { ZodError, ZodSchema } from 'zod'

export default class Validation {
  schema: ZodSchema

  constructor(schema: ZodSchema) {
    this.schema = schema
    this.validate = this.validate.bind(this)
  }

  validate(req: any, res: any, next: any) {
    try {
      this.schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.')
          acc[path] = { message: err.message }
          return acc
        }, {} as Record<string, { message: string }>)

        res.status(400).json({ errors: formattedErrors })
      } else {
        console.error(error)
        next(error)
      }
    }
  }
}
