import db from '../../../lib/db'
import { Transaction } from './schema'
import { removeImg } from '../../../utils/file'
import { TransactionType } from '@prisma/client'

export default class BrandRepository {
  create = async (payload: Transaction & { photoUrl?: string }) => {
    try {
      const date = new Date(payload.date)
      await db.transactionGoods.create({
        data: {
          qty: Number(payload.qty),
          type: payload.type,
          goodsId: Number(payload.goodsId),
          ...(payload.price ? { price: Number(payload.price) } : undefined),
          ...(payload.supplierId
            ? { supplierId: Number(payload.supplierId) }
            : undefined),
          date,
          isReturned: payload.isReturned === 'true',
          ...(payload.projectId
            ? { projectId: Number(payload.projectId) }
            : undefined),
        },
      })
      await this.updateGoods(
        Number(payload.goodsId),
        payload.type,
        Number(payload.qty)
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
      await this.isExist(id)
      const transaction = await db.transactionGoods.findUnique({
        where: { id },
      })
      const goods = await db.goods.findUnique({
        where: { id: Number(payload.goodsId) },
      })

      if (!transaction) throw Error('transaksi tidak ada')
      if (!goods) throw Error('barang tidak ada')

      await this.updateGoodsQty(
        goods.id,
        transaction.type,
        payload.type as TransactionType,
        transaction.qty,
        Number(payload.qty)
      )

      // handle when theres new photo
      if (payload.photoUrl) {
        if (transaction?.photoUrl) {
          removeImg(transaction.photoUrl)
        }
      }

      const date = payload.date ? new Date(payload.date) : new Date()

      await db.transactionGoods.update({
        data: {
          price: Number(payload.price),
          qty: Number(payload.qty),
          type: payload.type,
          goodsId: Number(payload.goodsId),
          supplierId: Number(payload.supplierId),
          date,
        },
        where: { id },
      })
    } catch (error) {
      throw error
    }
  }
  delete = async (id: number) => {
    try {
      await this.isExist(id)
      const data = await db.transactionGoods.findUnique({ where: { id } })

      if (data?.photoUrl) {
        removeImg(data.photoUrl)
      }

      await db.transactionGoods.delete({ where: { id } })
    } catch (error) {
      throw error
    }
  }
  read = async (type?: string) => {
    let baseQuery = {
      where: {},
      select: {
        good: {
          select: {
            id: true,
            name: true,
            measurement: {
              select: {
                name: true,
              },
            },
            brand: {
              select: {
                name: true,
              },
            },
          },
        },
        supplier: {
          select: {
            name: true,
          },
        },
        date: true,
        qty: true,
        price: true,
      },
    }

    if (type) {
      baseQuery = {
        ...baseQuery,
        where: {
          ...baseQuery.where,
          type: type,
        },
      }
    }
    return await db.transactionGoods.findMany({
      ...baseQuery,
      orderBy: {
        date: 'desc',
      },
    })
  }

  updateGoods = async (id: number, type: TransactionType, qty: number) => {
    if (type == 'in') {
      await db.goods.update({
        data: {
          qty: {
            increment: qty,
          },
          available: {
            increment: qty,
          },
        },
        where: { id },
      })
    }

    if (type == 'out') {
      await db.goods.update({
        data: {
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

    if (type == 'opname') {
      await db.goods.update({
        data: {
          available: qty,
          qty: qty,
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

    console.log(updateData)

    await db.goods.update({
      where: { id: goodsId },
      data: updateData,
    })
  }

  isExist = async (id: number) => {
    const data = await db.transactionGoods.findUnique({ where: { id } })
    if (!data) throw Error('Transaksi tidak ditemukan')
  }
}
