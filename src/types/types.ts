export type ValueOf<T> = T[keyof T]
export type AlphaNumeric = string | number
export enum QueryEvent {
  CROSS_OVER = 'crossOver',
  CROSS_UNDER = 'crossUnder',
}

export enum Ref {
  INDICATOR = 'INDICATOR',
  PRICE = 'PRICE',
  VOLUME = 'VOLUME',
}

export enum Timeframe {
  MINUTE_1 = '1Min',
  MINUTE_5 = '5Min',
  MINUTE_15 = '15Min',
  DAY = 'day',
  DAY_1 = '1D',
}

export interface Bar {
  date: Date
  openPrice: number
  highPrice: number
  lowPrice: number
  closePrice: number
  volume: number
}

export interface ConditionBranch {
  ref: ValueOf<Ref>
  type: string
  value: string | number
}

export interface Result {
  date: Date
  meta: ConditionBranch
  result: any
}

export interface Query {
  condition: {
    source: ConditionBranch
    target: ConditionBranch
    event: string
  }
  symbol: string
  timeframe: string
  startDate: string
  endDate: string
}
