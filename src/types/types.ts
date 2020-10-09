export type ValueOf<T> = T[keyof T]
export type AlphaNumeric = string | number
export enum QueryEvent {
  CROSS_OVER = 'CROSS_OVER',
  CROSS_UNDER = 'CROSS_UNDER',
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
  startEpochTime: number
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
  barTime: Date
  meta: ConditionBranch
  result: any
}

export interface Query {
  condition: {
    source: ConditionBranch
    target: ConditionBranch
    event: ValueOf<QueryEvent>
  }
  symbol: string
  timeframe: ValueOf<Timeframe>
  startDate: Date
  endDate: Date
}

// {
//     active: true,
//     _id: 5f7e59c65453d12d591b79e3,
//     symbol: 'F',
//     timeframe: '5Min',
//     message: 'F volume(current) cross_over volume(5000)',
//     entryDate: 2020-10-08T00:13:58.532Z,
//     __v: 0
//   }
