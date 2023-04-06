import { Candles } from "@prisma/client";
import { IntervalKeys } from "~~/types/IntervalMap";

export interface ITradeCandle extends Omit<Candles, "time"> {
  closeSum?: number;
  ma?: Record<number, number | null>;
}

export interface ITradeShare {
  interval: IntervalKeys;
  figi: string;
  date: string;
}
