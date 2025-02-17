import request from 'supertest'

describe('Auth', () => {
  it('should return error if not send any', async () => {
    const response = await request('http://localhost:5000')
      .post('/api/auth/login')
      .send({})
    expect(response.status).toBe(400)
  })
})
