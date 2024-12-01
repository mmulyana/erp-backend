import { NextFunction, Request, Response } from 'express'

import BaseController from '../../helper/base-controller'
import AccountRepository from '../account/repository'
import TelegramService from '../../helper/telegram'
import HelpdeskRepository from './repository'

export default class HelpdeskController extends BaseController {
  private repository: HelpdeskRepository = new HelpdeskRepository()
  private accountRepository: AccountRepository = new AccountRepository()
  private telegram: TelegramService = new TelegramService()

  constructor() {
    super('helpdesk')
  }

  createHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.repository.create(req.body)
      const user = await this.accountRepository.getAccountById(data.id)

      await this.telegram.send(`${data.message} dari ${user?.name}`, data.type)
      return this.response.success(res, 'Berhasil dikirim')
    } catch (error) {
      next(error)
    }
  }
  readHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query
      const data = await this.repository.findAll(
        String(type) as 'bug' | 'feature'
      )
      return this.response.success(res, this.message.successRead(), data)
    } catch (error) {
      next(error)
    }
  }
  updateHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const isExist = await this.repository.findById(Number(id))
      if (!isExist) {
        throw new Error('data tidak ditemukan')
      }
      await this.repository.updateById(Number(id), req.body)
      return this.response.success(res, this.message.successUpdate())
    } catch (error) {
      next(error)
    }
  }
  deleteHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const isExist = await this.repository.findById(Number(id))
      if (!isExist) {
        throw new Error('data tidak ditemukan')
      }
      await this.repository.deleteById(Number(id))
      return this.response.success(res, this.message.successDelete())
    } catch (error) {
      next(error)
    }
  }
}
