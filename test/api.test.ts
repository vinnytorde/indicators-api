import request from 'supertest'
import app from '../src/app'

describe('GET /api', () => {
  it('should return 200 OK', () => {
    return request(app).get('/api').expect(200)
  })
})

describe('GET /health/liveness', () => {
  it('should return 200 OK', () => {
    return request(app).get('/health/readiness').expect(200)
  })
})

describe('GET /health/readiness', () => {
  it('should return 200 OK', () => {
    return request(app).get('/health/liveness').expect(200)
  })
})
