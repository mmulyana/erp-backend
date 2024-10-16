import Message from '../utils/constant/message'
import ApiResponse from './api-response'

export default class BaseController {
  protected message: Message
  protected response: ApiResponse

  constructor(name: string) {
    this.message = new Message(name)
    this.response = new ApiResponse()
  }
}
