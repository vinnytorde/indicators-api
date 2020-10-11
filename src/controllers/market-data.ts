'use strict'

import { Bar } from 'types'
import alpaca from '../util/alpaca'

export interface BarsRequest {
  timeframe: string
  symbol: Array<string>
  config: {
    limit?: number
    start?: string
    end?: string
    after?: string
    until?: string
  }
}

const isActiveHours = (bar: Bar): boolean => {
  let date = bar.date
  let isDateAfterOpen =
    date.getUTCHours() === 13
      ? date.getUTCMinutes() >= 30
      : date.getUTCHours() > 13
  let isDateBeforeClose = date.getUTCHours() < 20

  return isDateAfterOpen && isDateBeforeClose
}

type BarLike = {
  startEpochTime: number
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
}

const convertEpochToDate = (bar: BarLike): Bar => {
  return {
    ...bar,
    date: new Date(bar.startEpochTime * 1000),
  }
}

const normalizeMarketData = (config: object) => (data: object) => {
  return Object.entries(data)
    .map(([symbol, bars]) => {
      let sanitizedBars = bars.map(convertEpochToDate).filter(isActiveHours)
      return [symbol, sanitizedBars]
    })
    .reduce((entries: any, entry: Array<any>) => {
      entries[entry[0]] = entry[1]
      return entries
    }, {})
}

export function getBars(
  request: BarsRequest
): Promise<Map<string, Array<Bar>>> {
  return alpaca
    .getBars(request.timeframe, request.symbol, request.config)
    .then(normalizeMarketData(request.config))
    .then((bars: object) => new Map<string, Array<Bar>>(Object.entries(bars)))
}
