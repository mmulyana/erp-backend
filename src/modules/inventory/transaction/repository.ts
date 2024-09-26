import db from '../../../lib/db'
import { Transaction } from './schema'
import { removeImg } from '../../../utils/file'
import { TransactionType } from '@prisma/client'

export default class BrandRepository {
  create = async (payload: Transaction & { photoUrl?: string }) => {
    try {
      await db.transactionGoods.create({ data: payload })
      await this.updateGoods(
        payload.goodsId,
        payload.type,
        payload.qty,
        payload.price
      )
    } catch (error) {
      throw error
    }
  }
  update = async (
    id: number,
    payload: Partial<Transaction> & { photoUrl?: string }
  ) => {
    try {
      const transaction = await db.transactionGoods.findUnique({
        where: { id },
      })
      const goods = await db.goods.findUnique({
        where: { id: payload.goodsId },
      })

      if (!transaction) throw Error('transaksi tidak ada')
      if (!goods) throw Error('barang tidak ada')

      await this.updateGoodsQty(
        goods.id,
        transaction.type,
        payload.type as TransactionType,
        transaction.qty,
        payload.qty as number
      )

      // handle when theres new photo
      if (payload.photoUrl) {
        if (transaction?.photoUrl) {
          removeImg(transaction.photoUrl)
        }
      }

      await db.transactionGoods.update({ data: payload, where: { id } })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      const data = await db.transactionGoods.findUnique({ where: { id } })

      if (data?.photoUrl) {
        removeImg(data.photoUrl)
      }

      await db.transactionGoods.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async () => {
    try {
      const baseQuery = {
        where: {},
      }

      return await db.transactionGoods.findMany(baseQuery)
    } catch (error) {
      throw error
    }
  }

  updateGoods = async (
    id: number,
    type: TransactionType,
    qty: number,
    price: number
  ) => {
    const total_price = qty * price

    if (type == 'in') {
      await db.goods.update({
        data: {
          total_price: {
            increment: total_price,
          },
          qty: {
            increment: qty,
          },
        },
        where: { id },
      })
    }

    if (type == 'out') {
      await db.goods.update({
        data: {
          total_price: {
            decrement: total_price,
          },
          qty: {
            decrement: qty,
          },
          available: {
            decrement: qty,
          },
        },
        where: { id },
      })
    }

    if (type == 'out') {
      await db.goods.update({
        data: {
          total_price: {
            decrement: total_price,
          },
          qty: {
            decrement: qty,
          },
          available: {
            decrement: qty,
          },
        },
        where: { id },
      })
    }

    if (type == 'borrowed') {
      await db.goods.update({
        data: {
          available: {
            decrement: qty,
          },
        },
        where: { id },
      })
    }

    if (type == 'returned') {
      await db.goods.update({
        data: {
          available: {
            increment: qty,
          },
        },
        where: { id },
      })
    }
  }

  updateGoodsQty = async (
    goodsId: number,
    oldType: TransactionType,
    newType: TransactionType,
    oldQty: number,
    newQty: number
  ) => {
    const updateData: any = {}

    switch (oldType) {
      case 'in':
        updateData.available = { decrement: oldQty }
        updateData.qty = { decrement: oldQty }
        break
      case 'out':
        updateData.available = { increment: oldQty }
        updateData.qty = { increment: oldQty }
        break
      case 'borrowed':
        updateData.available = { increment: oldQty }
        break
      case 'returned':
        updateData.available = { decrement: oldQty }
        break
      case 'opname':
        break
    }

    // Apply the effects of the new transaction
    switch (newType) {
      case 'in':
        updateData.available = { increment: newQty }
        updateData.qty = { increment: newQty }
        break
      case 'out':
        updateData.available = { decrement: newQty }
        updateData.qty = { decrement: newQty }
        break
      case 'opname':
        updateData.available = newQty
        updateData.qty = newQty
        break
      case 'borrowed':
        updateData.available = { decrement: newQty }
        break
      case 'returned':
        updateData.available = { increment: newQty }
        break
    }

    await db.goods.update({
      where: { id: goodsId },
      data: updateData,
    })
  }
}
