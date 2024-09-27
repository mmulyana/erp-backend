import { z } from 'zod'

export const goodsSchema = z.object({
  name: z.string(),
  minimum: z.string(),
  qty: z.string(),
  available: z.string(),
  locationId: z.string(),
  measurementId: z.string(),
  categoryId: z.string(),
  brandId: z.string(),
})
export const updateGoodsSchema = goodsSchema.partial()
export type Goods = z.infer<typeof goodsSchema>
export type updateGoods = z.infer<typeof updateGoodsSchema>
