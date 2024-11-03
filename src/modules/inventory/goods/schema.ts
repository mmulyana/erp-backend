import { z } from 'zod'

export const goodsSchema = z.object({
  name: z.string(),
  minimum: z.string().optional(),
  qty: z.string(),
  available: z.string().optional(),
  locationId: z.string().optional(),
  measurementId: z.string().optional(),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
})
export const updateGoodsSchema = goodsSchema.partial()
export type Goods = z.infer<typeof goodsSchema>
export type updateGoods = z.infer<typeof updateGoodsSchema>
