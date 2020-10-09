'use strict'

import { Response, Request } from 'express'
import { Query, ConditionBranch, Bar } from 'types'
import { indicators, events } from '../util/indicators'

/**
 * Compute query and return result set
 * @route GET /indicators/query
 */
export const query = (req: Request, res: Response) => {
  const query: Query = req.body

  console.log(query)

  res.status(200).send({ test: true })
}

function processIndicator(config: ConditionBranch, dataset: Array<Bar>) {
  let { type, value } = config

  if (indicators.has(type)) {
    return indicators.get(type)(value, dataset)
  } else {
    throw new Error(`${type} indicator type is not supported!`)
  }
}

function processTriggerEvent(
  event: string,
  source: ConditionBranch,
  target: ConditionBranch
) {
  if (events.has(event)) {
    return indicators.get(event)(source, target)
  } else {
    throw new Error(`${event} event type is not supported!`)
  }
}
