export enum IntervalMap {
  "1_min" = "CANDLE_INTERVAL_1_MIN",
  "5_min" = "CANDLE_INTERVAL_5_MIN",
  "15_min" = "CANDLE_INTERVAL_15_MIN",
}

export type IntervalKeys = keyof typeof IntervalMap;
