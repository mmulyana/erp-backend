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

export default class KanbanSocket {
  public socket: Socket
  private repository: KanbanRepository = new KanbanRepository()

  constructor(socket: Socket) {
    this.socket = socket
    this.setupListener()
  }

  setupListener = () => {
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
    const boards = await this.repository.readBoard()
    this.socket.emit(EVENT_UPDATED_DATA, boards)
  }

  handleCreateProject = async (data: Items) => {
    await this.repository.createItem(data)
    const boards = await this.repository.readBoard()
    this.socket.emit(EVENT_UPDATED_DATA, boards)
  }

  handleUpdateProjet = async (
    id: number,
    payload: Omit<Items, 'position' | 'employees' | 'labels'>
  ) => {
    await this.repository.updateProject(id, payload)
    const boards = await this.repository.readBoard()
    this.socket.emit(EVENT_UPDATED_DATA, boards)
  }

  handleOrderItem = async (payload: OrderItems) => {
    await this.repository.updateOrderItems(payload)
    const boards = await this.repository.readBoard()
    this.socket.emit(EVENT_UPDATED_DATA, boards)
  }

  handleDeleteProject = async (id: string) => {
    await this.repository.deleteItem(id)
    const boards = await this.repository.readBoard()
    this.socket.emit(EVENT_UPDATED_DATA, boards)
  }
}
