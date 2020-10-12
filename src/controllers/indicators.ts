'use strict'

import { Response, Request } from 'express'
import { Comparison, ConditionBranch, Bar, Result, Query } from 'types'
import { indicators, events } from '../util/indicators'
import * as marketDataController from './market-data'

/**
 * @route GET /indicators/compare
 */
export const compare = async (req: Request, res: Response) => {
  const compareQuery: Comparison = req.body

  const request: marketDataController.BarsRequest = {
    timeframe: compareQuery.timeframe,
    symbol: [compareQuery.symbol],
    config: {
      start: compareQuery.startDate,
      end: compareQuery.endDate,
    },
  }

  const dataset = await marketDataController.getBars(request)

  const { event, source, target } = compareQuery.condition
  const sourceResult = processIndicator(
    source,
    dataset.get(compareQuery.symbol)
  )
  const targetResult = processIndicator(
    target,
    dataset.get(compareQuery.symbol)
  )

  const result: Array<Result> = processTriggerEvent(
    event,
    sourceResult,
    targetResult
  )

  res.status(200).send(result)
}

export const query = async (req: Request, res: Response) => {
  const marketQuery: Query = req.body

  const request: marketDataController.BarsRequest = {
    timeframe: marketQuery.timeframe,
    symbol: [marketQuery.symbol],
    config: {
      start: marketQuery.startDate,
      end: marketQuery.endDate,
    },
  }

  const { query } = marketQuery

  const dataset = await marketDataController.getBars(request)
  const result = processIndicator(query, dataset.get(marketQuery.symbol))

  return res.status(200).send(
    result.map(entry => {
      return {
        ...entry,
        symbol: marketQuery.symbol,
      }
    })
  )
}

function processIndicator(
  config: ConditionBranch,
  dataset: Array<Bar>
): Array<Result> {
  let { type, value } = config

  if (indicators.has(type)) {
    return indicators.get(type)(value, dataset)
  } else {
    throw new Error(`${type} indicator type is not supported!`)
  }
}

function processTriggerEvent(
  event: string,
  source: Array<Result>,
  target: Array<Result>
) {
  if (events.has(event)) {
    return events.get(event)(source, target)
  } else {
    throw new Error(`${event} event type is not supported!`)
  }
}
