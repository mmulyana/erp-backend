import { Response } from 'express'

export default class ApiResponse {
  success(res: Response, message?: string, data?: any) {
    res
      .status(200)
      .json({
        data,
        message,
      })
      .end()
  }

  error(res: Response, message: string, code?: number) {
    res
      .status(code || 400)
      .json({
        message,
      })
      .end()
  }
}
