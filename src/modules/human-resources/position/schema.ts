import { z } from 'zod'

const positionSchema = {
  create: z.object({
    name: z.string(),
    description: z.string().optional(),
    employeeIds: z.number().array().optional()
  }),
  update: z.object({
    name: z.string(),
    description: z.string().optional(),
    employeeIds: z.number().array().optional()
  }),
}

export default positionSchema