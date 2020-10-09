import technicalIndicators from 'technicalindicators'
import { Bar, Result, AlphaNumeric } from '../types/types'

const open = (bar: Bar) => bar.openPrice

function crossOver(source: Array<number>, target: Array<number>) {
  return technicalIndicators.crossUp({
    lineA: target,
    lineB: source,
  })
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
      barTime: new Date(dataPoint.startEpochTime * 1000),
    }
    console.log(resultEntry)
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
      barTime: new Date(dataPoint.startEpochTime * 1000),
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
    barTime: new Date(dataPoint.startEpochTime * 1000),
  }))

  return resultSet
}

export const indicators: Map<string, Function> = new Map<string, Function>()

export const events: Map<string, Function> = new Map<string, Function>()

events.set('crossOver', crossOver)
indicators.set('price', price)
indicators.set('EMA', EMA)
indicators.set('SMA', SMA)
