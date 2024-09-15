import { z } from 'zod'

export const boardContainer = z.object({
  name: z.string(),
  color: z.string(),
})

export const boardItems = z.object({
  containerId: z.string(),

  // project
  name: z.string(),
  startDate: z.string().datetime(),
  budget: z.number().optional(),
  priority: z.enum(['urgent', 'high', 'medium', 'low']),
  labels: z.number().array().optional(),
  employees: z.number().array().optional(),
  clientId: z.number().optional(),
})

export type Container = z.infer<typeof boardContainer>
export type Items = z.infer<typeof boardItems>
export type OrderItems = {
  itemId: string
  containerId: string
  position: number
}