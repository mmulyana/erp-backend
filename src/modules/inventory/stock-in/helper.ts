export const processTotalPrice = (
  entries: {
    items: { quantity: number; unitPrice: number; totalPrice?: number }[]
  }[],
) => {
  return entries.map((entry) => ({
    ...entry,
    totalPrice: entry.items.reduce(
      (sum, item) => sum + (item.totalPrice ?? item.unitPrice * item.quantity),
      0,
    ),
  }))
}
