import { Query, Ref, QueryEvent, Timeframe } from '../src/types/types'
import request from 'supertest'
import app from '../src/app'

describe('GET /indicators/query', () => {
  it('should return 200 OK', () => {
    const marketQuery: Query = {
      condition: {
        source: {
          ref: Ref.INDICATOR,
          type: 'EMA',
          value: 8,
        },
        target: {
          ref: Ref.INDICATOR,
          type: 'SMA',
          value: 12,
        },
        event: QueryEvent.CROSS_OVER,
      },
      symbol: 'ZM',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-10-07T13:30:00.000Z',
      endDate: '2020-10-07T20:00:00.000Z',
    }

    return request(app).get('/indicators/query').send(marketQuery).expect(200)
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
