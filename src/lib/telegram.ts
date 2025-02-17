import axios from 'axios'

class TelegramService {
  private static instance: TelegramService
  private baseUrl: string
  private api

  private constructor(
    baseUrl = process.env.TELEGRAM_URL || 'http://localhost:5003',
  ) {
    this.baseUrl = baseUrl
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  public static getInstance(): TelegramService {
    if (!this.instance) {
      this.instance = new TelegramService()
    }
    return this.instance
  }

  private static getReplyTo(type: string): number {
    switch (type) {
      case 'bug':
        return 3
      case 'feature':
        return 2
      case 'log':
        return 21
      default:
        return 1
    }
  }

  async send(message: string, type: string): Promise<boolean> {
    try {
      await this.api.post('/send', {
        message,
        group_id: 2450762709,
        reply_to: TelegramService.getReplyTo(type),
      })
      return true
    } catch (error) {
      console.error('Telegram send failed:', error)
      return false
    }
  }
}

export default TelegramService.getInstance()
