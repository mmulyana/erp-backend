import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

export default class TelegramService {
    private baseUrl: string;

    constructor(baseUrl = process.env.TELEGRAM_URL || "http://localhost:5003") {
        this.baseUrl = baseUrl
    }

    private getReplyTo(type: string): number {
        switch (type) {
            case 'bug':
                return 3;
            case 'feature':
                return 2;
            case 'log':
                return 21;
            default:
                return 1;
        }
    }

    async send(message: string, type: string): Promise<boolean> {
        try {
            await axios.post(`${this.baseUrl}/send`, {
                message: message,
                group_id: 2450762709,
                reply_to: this.getReplyTo(type)
            });

            return true;
        } catch (error) {
            console.error('Telegram send failed:', error);
            return false;
        }
    }
}