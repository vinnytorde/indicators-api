import {
  Query,
  Ref,
  QueryEvent,
  Timeframe,
  Comparison,
  Indicators,
  Prices,
} from '../src/types/types'
import request from 'supertest'
import app from '../src/app'

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

describe('GET /indicators/query', () => {
  it('should handle relative strength index', () => {
    const marketQuery: Query = {
      query: {
        ref: Ref.INDICATOR,
        type: Indicators.RSI,
        value: 14,
      },
      symbol: 'ZM',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-10-07T13:30:00.000Z',
      endDate: '2020-10-07T20:00:00.000Z',
    }

    return request(app).get('/indicators/query').send(marketQuery).expect(200)
  })
  it('should handle exponential moving averages', () => {
    const marketQuery: Query = {
      query: {
        ref: Ref.INDICATOR,
        type: Indicators.EMA,
        value: 8,
      },
      symbol: 'ZM',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-10-07T13:30:00.000Z',
      endDate: '2020-10-07T20:00:00.000Z',
    }

    return request(app).get('/indicators/query').send(marketQuery).expect(200)
  })
  it('should handle simple moving averages', () => {
    const marketQuery: Query = {
      query: {
        ref: Ref.INDICATOR,
        type: Indicators.MA,
        value: 8,
      },
      symbol: 'F',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-08-12T13:30:00.000Z',
      endDate: '2020-08-12T20:00:00.000Z',
    }

    return request(app).get('/indicators/query').send(marketQuery).expect(200)
  })
  it('should handle open price', () => {
    const marketQuery: Query = {
      query: {
        ref: Ref.INDICATOR,
        type: Indicators.PRICE,
        value: Prices.OPEN,
      },
      symbol: 'AAPL',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-09-09T13:30:00.000Z',
      endDate: '2020-09-097T20:00:00.000Z',
    }
    return request(app).get('/indicators/query').send(marketQuery).expect(200)
  })
  it('should handle close price', () => {
    const marketQuery: Query = {
      query: {
        ref: Ref.INDICATOR,
        type: Indicators.PRICE,
        value: Prices.CLOSE,
      },
      symbol: 'AAPL',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-09-09T13:30:00.000Z',
      endDate: '2020-09-097T20:00:00.000Z',
    }
    return request(app).get('/indicators/query').send(marketQuery).expect(200)
  })
})

describe('GET /indicators/compare', () => {
  it('should return 200 OK', () => {
    const marketQuery: Comparison = {
      condition: {
        source: {
          ref: Ref.INDICATOR,
          type: Indicators.EMA,
          value: 8,
        },
        target: {
          ref: Ref.INDICATOR,
          type: Indicators.MA,
          value: 12,
        },
        event: QueryEvent.CROSS_OVER,
      },
      symbol: 'ZM',
      timeframe: Timeframe.MINUTE_5,
      startDate: '2020-10-07T13:30:00.000Z',
      endDate: '2020-10-07T20:00:00.000Z',
    }

    return request(app).get('/indicators/compare').send(marketQuery).expect(200)
  })
})
