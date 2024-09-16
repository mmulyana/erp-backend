import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime().optional(),
  budget: z.number().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional(),
  labels: z.number().array().optional(),
  employees: z.number().array().optional(),
  containerId: z.string(),
  clientId: z.number().optional(),
})
export const updateProjectSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime().optional(),
  budget: z.number().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']).optional(),
  labels: z.number().array().optional(),
  employees: z.number().array().optional(),
  clientId: z.number().optional(),
})

export type Project = z.infer<typeof createProjectSchema>