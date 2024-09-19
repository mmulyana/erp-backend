import { Socket } from 'socket.io'
import KanbanRepository from './repository'
import { Container, Items, OrderItems } from './schema'
import {
  CREATE_BOARD,
  CREATE_PROJECT,
  DELETE_PROJECT,
  EVENT_INITIAL_DATA,
  EVENT_UPDATED_DATA,
  REQUEST_BOARD,
  UPDATE_ORDER_ITEMS,
  UPDATE_PROJECT,
} from '../../../utils/constant/socket'
import { Server } from 'socket.io'

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
    await this.repository.createItem(data)
    await this.handleUpdatedData()
  }

  handleUpdateProjet = async (
    id: number,
    payload: Omit<Items, 'position' | 'employees' | 'labels'>
  ) => {
    await this.repository.updateProject(id, payload)
    await this.handleUpdatedData()
  }

  handleOrderItem = async (payload: OrderItems[]) => {
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
