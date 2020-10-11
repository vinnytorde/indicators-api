'use strict'

import { Response, Request } from 'express'
import { Query, ConditionBranch, Bar, Result } from 'types'
import { indicators, events } from '../util/indicators'
import * as marketDataController from './market-data'
/**
 * Compute query and return result set
 * @route GET /indicators/query
 */
export const query = async (req: Request, res: Response) => {
  const query: Query = req.body

  const request: marketDataController.BarsRequest = {
    timeframe: query.timeframe,
    symbol: [query.symbol],
    config: {
      start: query.startDate,
      end: query.endDate,
    },
  }

  const dataset = await marketDataController.getBars(request)

  const { event, source, target } = query.condition
  const sourceResult = processIndicator(source, dataset.get(query.symbol))
  const targetResult = processIndicator(target, dataset.get(query.symbol))

  const result: Array<Result> = processTriggerEvent(
    event,
    sourceResult,
    targetResult
  )

  // res.status(200).send(sourceResult)
  res.status(200).send(
    sourceResult
      .filter(r => r.result)
      .map(result => {
        return { ...result, date: result.date.toString() }
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
