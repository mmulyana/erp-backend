import { TransactionGoods, TransactionType } from '@prisma/client'
import { Transaction } from './schema'
import db from '../../../lib/db'

export default class TransactionRepository {
  create = async (payload: Transaction) => {
    const date = new Date(payload.date)

    await db.$transaction(async (prisma) => {
      for (const item of payload.items) {
        if (item.type === 'out' || item.type === 'borrowed') {
          const goods = await prisma.goods.findUnique({
            where: { id: Number(item.goodsId) },
            select: { available: true, name: true },
          })

          if (!goods) {
            throw new Error(`Barang dengan ID ${item.goodsId} tidak ditemukan`)
          }

          const requestedQty = Number(item.qty)
          if (requestedQty > goods.available) {
            throw new Error(
              `Stok tidak mencukupi untuk ${goods.name}. Stok tersedia: ${goods.available}, Permintaan: ${requestedQty}`
            )
          }
        }
      }

      for (const item of payload.items) {
        await prisma.transactionGoods.create({
          data: {
            qty: Number(item.qty),
            type: item.type,
            goodsId: Number(item.goodsId),
            ...(item.price ? { price: Number(item.price) } : undefined),
            ...(payload.supplierId
              ? { supplierId: Number(payload.supplierId) }
              : undefined),
            date,
          },
        })

        await this.updateGoods(
          Number(item.goodsId),
          item.type,
          Number(item.qty)
        )
      }
    })
  }

  update = async (id: number, payload: Partial<TransactionGoods>) => {
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
  }
  delete = async (id: number) => {
    await this.isExist(id)
    await db.transactionGoods.delete({ where: { id } })
  }
  read = async (type?: string, goodsId?: number) => {
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
            location: {
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
        id: true,
        date: true,
        qty: true,
        price: true,
        type: true,
        project: {
          select: {
            name: true,
          },
        },
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

    if (goodsId) {
      baseQuery = {
        ...baseQuery,
        where: {
          ...baseQuery.where,
          goodsId,
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
  readOne = async (id: number) => {
    return await db.transactionGoods.findUnique({ where: { id } })
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

    await db.goods.update({
      where: { id: goodsId },
      data: updateData,
    })
  }

  readGoodsBorrowed = async () => {
    return await db.transactionGoods.findMany({
      where: { isReturned: false },
      include: {
        project: true,
        good: true,
      },
    })
  }

  isExist = async (id: number) => {
    const data = await db.transactionGoods.findUnique({ where: { id } })
    if (!data) throw Error('Transaksi tidak ditemukan')
  }
}
