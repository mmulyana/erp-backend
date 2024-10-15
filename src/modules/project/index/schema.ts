import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string(),
  containerId: z.string(),
  date_created: z.string().datetime().optional(),
  date_started: z.string().datetime().optional(),
  date_ended: z.string().datetime().optional(),
  net_value: z.number().optional(),
  payment_status: z.number().optional(),
  progress: z.number().optional(),
  labels: z.number().array().optional(),
  employees: z.number().array().optional(),
  clientId: z.number().optional(),
  leadId: z.number().optional(),
})
export const updateProjectSchema = createProjectSchema
  .omit({
    name: true,
  })
  .extend({
    name: z.string().optional(),
  })

export type Project = z.infer<typeof createProjectSchema>
