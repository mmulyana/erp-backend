import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime(),
  budget: z.number().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  labels: z.number().array(),
  employees: z.number().array(),
  containerId: z.string(),
  clientId: z.number().optional(),
})
export const updateProjectSchema = z.object({
  name: z.string(),
  startDate: z.string().datetime(),
  budget: z.number().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  labels: z.number().array(),
  employees: z.number().array(),
  clientId: z.number().optional(),
})

export type Project = z.infer<typeof createProjectSchema>