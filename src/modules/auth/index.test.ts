import request from 'supertest'
import { TEST_URL } from '@/utils/constant'

describe('Auth', () => {
  it('should return error if not send any', async () => {
    const response = await request(TEST_URL).post('/api/auth/login').send({})
    expect(response.status).toBe(400)
  })
})
