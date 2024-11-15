import { Server, Socket } from 'socket.io'
import ActivityRepository from './repository'
import {
  JOIN_BY_PROJECT,
  MESSAGES_BY_PROJECT,
  ERROR_JOIN,
  MESSAGES_BY_PARENT,
  JOIN_BY_PARENT,
  DATA_ROOMS,
  ERROR_ROOM,
  REQUEST_ROOMS,
} from '../../../utils/constant/socket'

export default class ActivitySocket {
  public socket: Socket
  private io: Server
  private repository: ActivityRepository = new ActivityRepository()

  constructor(socket: Socket, io: Server) {
    this.socket = socket
    this.io = io
    this.setupListener()
  }

  public setupListener = () => {
    this.socket.on(JOIN_BY_PROJECT, this.handleJoinChatByProject)
    this.socket.on(JOIN_BY_PARENT, this.handleJoinChatById)
    this.socket.on(REQUEST_ROOMS, this.handleReadAllRoom)
  }

  handleJoinChatByProject = async ({ id }: { id: number }) => {
    try {
      const projectRoom = `project-${id}`

      const isRoomProjectExist = this.socket.rooms.has(projectRoom)
      if (isRoomProjectExist) {
        const data = await this.repository.findByProject(id)
        this.socket.emit(MESSAGES_BY_PROJECT, data)
        return
      }

      const currentRoomProject = Array.from(this.socket.rooms)
      currentRoomProject.forEach((room) => {
        if (room !== this.socket.id && room.startsWith('project-')) {
          this.socket.leave(room)
        }
      })

      await this.socket.join(projectRoom)
      const data = await this.repository.findByProject(id)
      this.socket.emit(MESSAGES_BY_PROJECT, data)
    } catch (error) {
      this.socket.emit(ERROR_JOIN, {
        message: 'Gagal mendapatkan data aktivitas proyek ini',
      })
    }
  }

  handleJoinChatById = async ({ id }: { id: number }) => {
    try {
      const detailRoom = `detail-${id}`

      const isRoomDetailExist = this.socket.rooms.has(detailRoom)
      if (isRoomDetailExist) {
        const data = await this.repository.findByParent(id)
        this.socket.emit(MESSAGES_BY_PARENT, data)
        return
      }

      const currentRoomProject = Array.from(this.socket.rooms)
      currentRoomProject.forEach((room) => {
        if (room !== this.socket.id && room.startsWith('detail-')) {
          this.socket.leave(room)
        }
      })

      await this.socket.join(detailRoom)
      const data = await this.repository.findByParent(id)
      this.socket.emit(MESSAGES_BY_PARENT, data)
    } catch (error) {
      this.socket.emit(ERROR_JOIN, {
        message: 'Gagal mendapatkan detail aktivitas ini',
      })
    }
  }

  handleReadAllRoom = async () => {
    try {
      const rooms = this.io.sockets.adapter.rooms
      this.socket.emit(DATA_ROOMS, { rooms })
    } catch (error) {
      this.socket.emit(ERROR_ROOM, { error })
    }
  }
}
