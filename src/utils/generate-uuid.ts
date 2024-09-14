import { v4 } from 'uuid'

export function generateUUID() {
  return v4().replace(/-/g, '').substring(0, 8)
}
