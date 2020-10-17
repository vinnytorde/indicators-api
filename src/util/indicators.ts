import * as technicalIndicators from 'technicalindicators'
import {
  Bar,
  Result,
  AlphaNumeric,
  QueryEvent,
  Indicators,
  Ref,
  Prices,
} from '../types/types'

const closePrice = (bar: Bar) => bar.closePrice
const openPrice = (bar: Bar) => bar.openPrice

const stringifyTest = (source: Result, target: Result, eventName: string) => {
  return `${source.meta.ref} ${source.meta.type}(${source.meta.value}) ${eventName} ${target.meta.ref} ${target.meta.type}(${target.meta.value})`
}

const normalizeDates = (
  source: Array<Result>,
  target: Array<Result>
): { sourceBars: Array<Result>; targetBars: Array<Result> } => {
  const sortByOldest = (a: Result, b: Result): number =>
    a.date.getTime() - b.date.getTime()

  let sourceBars = [...source].sort(sortByOldest)
  let targetBars = [...target].sort(sortByOldest)

  while (sourceBars.length !== targetBars.length) {
    let longest =
      sourceBars.length > targetBars.length ? sourceBars : targetBars

    longest.shift()
  }

  return { sourceBars, targetBars }
}

function crossOver(
  source: Array<Result>,
  target: Array<Result>
): Array<Result> {
  let { sourceBars, targetBars } = normalizeDates(source, target)

  return technicalIndicators
    .crossUp({
      lineA: sourceBars.map(resultEntry => {
        return resultEntry.result
      }),
      lineB: targetBars.map(resultEntry => {
        return resultEntry.result
      }),
    })
    .map((crossUpValue, index) => {
      let resultEntry = {
        meta: {
          ref: 'test',
          type: 'result',
          value: stringifyTest(source[0], target[0], QueryEvent.CROSS_OVER),
        },
        result: crossUpValue,
        date: sourceBars[index].date,
      }
      return resultEntry
    })
}

function EMA(period: number, dataset: Array<Bar>): Array<Result> {
  let result = technicalIndicators.ema({
    period,
    values: dataset.map(closePrice),
  })

  return dataset.slice(period - 1).map((dataPoint, index) => {
    let resultEntry = {
      meta: {
        ref: 'indicator',
        type: 'EMA',
        value: period,
      },
      result: result[index],
      date: dataPoint.date,
    }
    return resultEntry
  })
}

function MA(period: number, dataset: Array<Bar>): Array<Result> {
  let result = technicalIndicators.sma({
    period,
    values: dataset.map(closePrice),
  })

  return dataset.slice(period - 1).map((dataPoint, index) => {
    let resultEntry = {
      meta: {
        ref: Ref.INDICATOR,
        type: Indicators.MA,
        value: period,
      },
      result: result[index],
      date: dataPoint.date,
    }

    return resultEntry
  })
}

function price(value: AlphaNumeric, dataset: Array<Bar>): Array<Result> {
  let getResult = (dataPoint: Bar): number => {
    if (value === Prices.OPEN) {
      return openPrice(dataPoint)
    }
    if (value === Prices.CLOSE) {
      return closePrice(dataPoint)
    }
  }

  let result = dataset.map(dataPoint => ({
    meta: {
      ref: Ref.INDICATOR,
      type: Indicators.PRICE,
      value,
    },
    result: getResult(dataPoint),
    date: dataPoint.date,
  }))

  return result
}

function RSI(period: number, dataset: Array<Bar>): Array<Result> {
  let result = technicalIndicators.rsi({
    period,
    values: dataset.map(closePrice),
  })

  return dataset.slice(period).map((dataPoint, index) => {
    let resultEntry = {
      meta: {
        ref: Ref.INDICATOR,
        type: Indicators.RSI,
        value: period,
      },
      result: result[index],
      date: dataPoint.date,
    }

    return resultEntry
  })
}

export const indicators: Map<string, Function> = new Map<string, Function>()

export const events: Map<string, Function> = new Map<string, Function>()

events.set(QueryEvent.CROSS_OVER, crossOver)

indicators.set(Indicators.EMA, EMA)
indicators.set(Indicators.MA, MA)
indicators.set(Indicators.PRICE, price)
indicators.set(Indicators.RSI, RSI)
