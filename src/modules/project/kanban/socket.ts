import { Socket } from 'socket.io'
import KanbanRepository from './repository'
import { boardItems, Container, Items, OrderItems } from './schema'
import {
  CREATE_BOARD,
  CREATE_PROJECT,
  DELETE_PROJECT,
  ERROR_CREATE_PROJECT,
  EVENT_INITIAL_DATA,
  EVENT_UPDATED_DATA,
  REQUEST_BOARD,
  SUCCESS_CREATE_PROJECT,
  UPDATE_ORDER_ITEMS,
  UPDATE_PROJECT,
} from '../../../utils/constant/socket'
import { Server } from 'socket.io'
import { ZodError } from 'zod'

export default class KanbanSocket {
  public socket: Socket
  private io: Server
  private repository: KanbanRepository = new KanbanRepository()

  constructor(socket: Socket, io: Server) {
    this.socket = socket
    this.io = io
    this.setupListener()
  }

  public setupListener = () => {
    this.socket.on(REQUEST_BOARD, this.handleReadBoards)
    this.socket.on(CREATE_BOARD, this.handleCreateBoard)
    this.socket.on(CREATE_PROJECT, this.handleCreateProject)
    this.socket.on(UPDATE_PROJECT, this.handleUpdateProjet)
    this.socket.on(UPDATE_ORDER_ITEMS, this.handleOrderItem)
    this.socket.on(DELETE_PROJECT, this.handleDeleteProject)
  }

  handleReadBoards = async () => {
    const data = await this.repository.readBoard()
    this.socket.emit(EVENT_INITIAL_DATA, data)
  }

  handleCreateBoard = async (data: Container) => {
    await this.repository.createBoard(data)
    await this.handleUpdatedData()
  }

  handleCreateProject = async (data: Items) => {
    try {
      boardItems.parse(data)
      await this.repository.createItem(data)
      this.io.emit(SUCCESS_CREATE_PROJECT, {
        message: 'Proyek berhasil ditambah',
      })
      await this.handleUpdatedData()
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.reduce((acc, err) => {
          const path = err.path.join('.')
          acc[path] = { message: err.message }
          return acc
        }, {} as Record<string, { message: string }>)

        return this.io.emit(ERROR_CREATE_PROJECT, { errors: formattedErrors })
      }
      return this.io.emit(ERROR_CREATE_PROJECT, { message: 'Silahkan ulangi' })
    }
  }

  handleUpdateProjet = async (
    id: number,
    payload: Omit<Items, 'position' | 'employees' | 'labels'>
  ) => {
    await this.repository.updateProject(id, payload)
    await this.handleUpdatedData()
  }

  handleOrderItem = async (payload: OrderItems) => {
    await this.repository.updateOrderItems(payload)
    await this.handleUpdatedData()
  }

  handleDeleteProject = async (id: string) => {
    await this.repository.deleteItem(id)
    await this.handleUpdatedData()
  }

  handleUpdatedData = async () => {
    const boards = await this.repository.readBoard()
    this.io.emit(EVENT_UPDATED_DATA, boards)
  }
}
