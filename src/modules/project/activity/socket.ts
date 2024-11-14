import { Server, Socket } from 'socket.io'
import ActivityRepository from './repository'
import { REQUEST_CHAT_BY_PROJECT } from '../../../utils/constant/socket'

export default class KanbanSocket {
  public socket: Socket
  private io: Server
  private repository: ActivityRepository = new ActivityRepository()

  constructor(socket: Socket, io: Server) {
    this.socket = socket
    this.io = io
    this.setupListener()
  }

  public setupListener = () => {
    this.socket.on(REQUEST_CHAT_BY_PROJECT, this.handleFindChatByProject)
  }

  handleFindChatByProject = async ({ id }: { id: number }) => {}
}
