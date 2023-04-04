import { Candles } from "@prisma/client";
import { IntervalKeys } from "~~/types/IntervalMap";

export interface ITradeCandle extends Candles {
  closeSum?: number;
  ma?: Record<number, number | null>;
}

export interface ITradeShare {
  interval: IntervalKeys;
  figi: string;
  startDate: string;
}
