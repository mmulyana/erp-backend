import { Socket } from 'socket.io'
import KanbanRepository, { OrderItems } from './repository'
import { Container, Items } from './schema'
import { EVENT_INITIAL_DATA, EVENT_UPDATED_DATA } from '@/utils/constant/socket'

export default class KanbanSocket {
  public socket: Socket
  private repository: KanbanRepository = new KanbanRepository()

  constructor(socket: Socket) {
    this.socket = socket
    this.setupListener()
  }

  setupListener = () => {
    this.socket.on('readBoards', this.handleReadBoards)
    this.socket.on('createBoard', this.handleCreateBoard)
    this.socket.on('createProject', this.handleCreateProject)
    this.socket.on('updateProject', this.handleUpdatProjet)
    this.socket.on('updatedOrderItems', this.handleUpdatProjet)
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

  handleUpdatProjet = async (
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
}
