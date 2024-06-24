import { Request } from 'express'

export interface PayloadUser {
  name: string
  email: string
  rolesId: number
  password?: string
}

export interface CustomRequest extends Request {
  user?: any
}
