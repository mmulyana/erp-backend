import { Transaction, UpdateSchema } from './schema'
import { Prisma, TransactionType } from '@prisma/client'
import db from '../../../lib/db'

interface FilterTransaction {
  goodsId?: number
  supplierId?: number
  startDate?: Date | string
  endDate?: Date | string
  type?: TransactionType
  projectId?: number
}

export default class TransactionRepository {
  create = async (payload: Transaction) => {
    const date = new Date(payload.date)

    await db.$transaction(async (prisma) => {
      for (const item of payload.items) {
        if (item.type === 'out' || item.type === 'borrowed') {
          const goods = await prisma.goods.findUnique({
            where: { id: Number(item.goodsId) },
            select: {
              available: true,
              name: true,
              qty: true,
            },
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
        const goodsBefore = await prisma.goods.findUnique({
          where: { id: Number(item.goodsId) },
          select: {
            qty: true,
            available: true,
          },
        })

        if (!goodsBefore) {
          throw new Error(`Barang dengan ID ${item.goodsId} tidak ditemukan`)
        }

        const transaction = await prisma.transactionGoods.create({
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

        await prisma.stockHistory.create({
          data: {
            transactionId: transaction.id,
            goodsId: Number(item.goodsId),
            qty_before: goodsBefore.qty,
            available_before: goodsBefore.available,
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

  update = async (id: number, payload: UpdateSchema) => {
    await this.isExist(id)

    const transaction = await db.transactionGoods.findUnique({
      where: { id },
      include: {
        good: true,
      },
    })

    if (!transaction) {
      throw new Error('Transaksi tidak ditemukan')
    }

    if (payload.projectId) {
      const project = await db.project.findUnique({
        where: { id: Number(payload.projectId) },
      })

      if (!project) {
        throw new Error('Project tidak ditemukan')
      }
    }

    const newQty = payload.qty ? Number(payload.qty) : transaction.qty

    return await db.$transaction(async (prisma) => {
      if (transaction.type === 'opname') {
        await this.handleOpnameUpdate(
          transaction.goodsId,
          transaction.qty,
          newQty
        )
      } else {
        if (payload.qty && payload.qty !== transaction.qty) {
          if (transaction.type === 'out' || transaction.type === 'borrowed') {
            const currentStock = transaction.good.available + transaction.qty
            if (newQty > currentStock) {
              throw new Error(
                `Stock tidak mencukupi. Tersedia: ${currentStock}, Diminta: ${newQty}`
              )
            }
          }

          await this.updateGoodsQty(
            transaction.goodsId,
            transaction.type,
            transaction.qty,
            newQty
          )
        }
      }

      const updatedTransaction = await prisma.transactionGoods.update({
        where: { id },
        data: {
          ...(payload.qty && { qty: Number(payload.qty) }),
          ...(payload.price && { price: Number(payload.price) }),
          ...(payload.supplierId && { supplierId: Number(payload.supplierId) }),
          ...(payload.projectId !== undefined && {
            projectId: payload.projectId ? Number(payload.projectId) : null,
          }),
          ...(payload.date && { date: new Date(payload.date) }),
          updated_at: new Date(),
        },
      })

      return updatedTransaction
    })
  }

  updateGoodsQty = async (
    goodsId: number,
    type: TransactionType,
    oldQty: number,
    newQty: number
  ) => {
    await this.resetStock(goodsId, type, oldQty)
    await this.applyNewStock(goodsId, type, newQty)
  }

  resetStock = async (goodsId: number, type: TransactionType, qty: number) => {
    switch (type) {
      case 'in':
        await db.goods.update({
          where: { id: goodsId },
          data: {
            qty: { decrement: qty },
            available: { decrement: qty },
          },
        })
        break

      case 'out':
        await db.goods.update({
          where: { id: goodsId },
          data: {
            qty: { increment: qty },
            available: { increment: qty },
          },
        })
        break

      case 'borrowed':
        await db.goods.update({
          where: { id: goodsId },
          data: {
            available: { increment: qty },
          },
        })
        break
    }
  }

  applyNewStock = async (
    goodsId: number,
    type: TransactionType,
    qty: number
  ) => {
    switch (type) {
      case 'in':
        await db.goods.update({
          where: { id: goodsId },
          data: {
            qty: { increment: qty },
            available: { increment: qty },
          },
        })
        break

      case 'out':
        await db.goods.update({
          where: { id: goodsId },
          data: {
            qty: { decrement: qty },
            available: { decrement: qty },
          },
        })
        break

      case 'borrowed':
        await db.goods.update({
          where: { id: goodsId },
          data: {
            available: { decrement: qty },
          },
        })
        break
    }
  }

  handleOpnameUpdate = async (
    goodsId: number,
    oldQty: number,
    newQty: number
  ) => {
    if (oldQty === newQty) return

    await db.goods.update({
      where: { id: goodsId },
      data: {
        qty: newQty,
        available: newQty,
      },
    })
  }

  delete = async (id: number) => {
    await this.isExist(id)

    return await db.$transaction(async (prisma) => {
      const transaction = await prisma.transactionGoods.findUnique({
        where: { id },
        include: {
          good: true,
          stock_history: true,
        },
      })

      if (!transaction) {
        throw new Error('Transaksi tidak ditemukan')
      }

      if (transaction.type === 'opname') {
        // Untuk opname, kembalikan ke stock sebelumnya dari history
        if (transaction.stock_history) {
          await prisma.goods.update({
            where: { id: transaction.goodsId },
            data: {
              qty: transaction.stock_history.qty_before,
              available: transaction.stock_history.available_before,
            },
          })
        }
      } else {
        // selain opname seperti biasa
        switch (transaction.type) {
          case 'in':
            await prisma.goods.update({
              where: { id: transaction.goodsId },
              data: {
                qty: { decrement: transaction.qty },
                available: { decrement: transaction.qty },
              },
            })
            break

          case 'out':
            await prisma.goods.update({
              where: { id: transaction.goodsId },
              data: {
                qty: { increment: transaction.qty },
                available: { increment: transaction.qty },
              },
            })
            break

          case 'borrowed':
            await prisma.goods.update({
              where: { id: transaction.goodsId },
              data: {
                available: { increment: transaction.qty },
              },
            })
            break
        }
      }

      if (transaction.stock_history) {
        await prisma.stockHistory.delete({
          where: { transactionId: id },
        })
      }

      await prisma.transactionGoods.delete({
        where: { id },
      })

      return transaction
    })
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
  readByPagination = async (
    page: number = 1,
    limit: number = 10,
    filter?: FilterTransaction
  ) => {
    const skip = (page - 1) * limit

    let where: Prisma.TransactionGoodsWhereInput = {}

    if (filter) {
      if (filter.goodsId && !isNaN(filter.goodsId)) {
        where.goodsId = filter.goodsId
      }

      if (filter.supplierId && !isNaN(filter.supplierId)) {
        where.supplierId = filter.supplierId
      }

      if (filter.projectId && !isNaN(filter.projectId)) {
        where.projectId = filter.projectId
      }

      if (filter.type) {
        where.type = filter.type
      }

      // Add date range filter if either startDate or endDate is provided
      if (filter.startDate || filter.endDate) {
        where.date = {}

        if (filter.startDate) {
          where.date.gte = new Date(filter.startDate)
        }

        if (filter.endDate) {
          where.date.lte = new Date(filter.endDate)
        }
      }
    }

    const data = await db.transactionGoods.findMany({
      skip,
      take: limit,
      where,
      include: {
        good: {
          include: {
            measurement: true,
            brand: true,
            location: true,
          },
        },
        supplier: {
          select: {
            name: true,
          },
        },
        project: {
          select: {
            name: true,
          },
        },
        User: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })

    const total = await db.transactionGoods.count({ where })
    const total_pages = Math.ceil(total / limit)

    return {
      data,
      total,
      page,
      limit,
      total_pages,
    }
  }
  findByProjectId = async (projectId: number) => {
    return await db.transactionGoods.findMany({
      where: { projectId },
      orderBy: { created_at: 'desc' },
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

  readGoodsBorrowed = async () => {
    return await db.transactionGoods.findMany({
      where: { is_returned: false, type: 'borrowed' },
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
