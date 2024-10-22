import { z } from 'zod'

const positionSchema = {
  create: z.object({
    name: z.string(),
    description: z.string().optional(),
    color: z.string().optional()
  }),
  update: z.object({
    name: z.string(),
    description: z.string().optional(),
    color: z.string().optional()
  }),
}

export default positionSchema