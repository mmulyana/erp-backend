import { z } from 'zod'

export const goodsSchema = z.object({
  name: z.string(),
  qty: z.number(),
  available: z.number(),
  locationId: z.number(),
  measurementId: z.number(),
  categoryId: z.number(),
  brandId: z.number(),
})
export const updateGoodsSchema = goodsSchema.extend({
  total_price: z.number(),
})
export type Goods = z.infer<typeof goodsSchema>
export type updateGoods = z.infer<typeof updateGoodsSchema>
