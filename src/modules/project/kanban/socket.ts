import SocketKeys from '@/utils/constant/socket'
import { readAll, updateOrderItems } from './repository'

const handleReadBoards = async (socket) => {
  const data = await readAll()
  socket.emit(SocketKeys.Initial, data)
}

const handleOrderItem = async (io) => async (payload) => {
  await updateOrderItems(payload)
  await handleUpdatedData(io)
}

export const handleUpdatedData = async (io) => {
  const boards = await readAll()
  io.emit(SocketKeys.Update, boards)
}

const setupKanbanSocket = (socket, io) => {
  socket.on(SocketKeys.Request, handleReadBoards(socket))
  socket.on(SocketKeys.UpdateOrder, handleOrderItem(io))
}

export default setupKanbanSocket
