import * as technicalIndicators from 'technicalindicators'
import { Bar, Result, AlphaNumeric, QueryEvent } from '../types/types'

const open = (bar: Bar) => bar.openPrice

const stringifyTest = (source: Result, target: Result, eventName: string) => {
  return `${source.meta.ref} ${source.meta.type}(${source.meta.value}) ${eventName} ${target.meta.ref} ${target.meta.type}(${target.meta.value})`
}

const normalizeResult = (
  source: Array<Result>,
  target: Array<Result>
): { sourceBars: Array<Result>; targetBars: Array<Result> } => {
  const sortByOldest = (a: Result, b: Result): number =>
    a.date.getTime() - b.date.getTime()
  let targetBars = [...target].sort(sortByOldest)
  let sourceBars = [...source].sort(sortByOldest)

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
  let { sourceBars, targetBars } = normalizeResult(source, target)

  let resultSet = technicalIndicators
    .crossUp({
      lineA: targetBars.map(resultEntry => {
        return resultEntry.result
      }),
      lineB: sourceBars.map(resultEntry => {
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

  return resultSet
}

function EMA(period: number, dataset: Array<Bar>): Array<Result> {
  let result = technicalIndicators.ema({
    period,
    values: dataset.map(open),
    reversedInput: true,
  })

  let resultSet = dataset.slice(period - 1).map((dataPoint, index) => {
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

  return resultSet
}

function SMA(period: number, dataset: Array<Bar>): Array<Result> {
  let result = technicalIndicators.sma({
    period,
    values: dataset.map(open),
  })

  let resultSet = dataset.slice(period - 1).map((dataPoint, index) => {
    let resultEntry = {
      meta: {
        ref: 'indicator',
        type: 'SMA',
        value: period,
      },
      result: result[index],
      date: dataPoint.date,
    }

    return resultEntry
  })

  return resultSet
}

function price(type: AlphaNumeric, dataset: Array<Bar>): Array<Result> {
  let getResult = (dataPoint: Bar): number => {
    if (typeof type === 'number') {
      return type
    }
    if (typeof type === 'string') {
      if (type === 'current') {
        return open(dataPoint)
      }
    }
  }

  let resultSet = dataset.map(dataPoint => ({
    meta: {
      ref: 'indicator',
      type: 'price',
      value: type,
    },
    result: getResult(dataPoint),
    date: dataPoint.date,
  }))

  return resultSet
}

export const indicators: Map<string, Function> = new Map<string, Function>()

export const events: Map<string, Function> = new Map<string, Function>()

events.set(QueryEvent.CROSS_OVER, crossOver)

indicators.set('price', price)
indicators.set('EMA', EMA)
indicators.set('SMA', SMA)
