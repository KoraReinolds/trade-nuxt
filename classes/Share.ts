import { Candles } from "@prisma/client";
import { IntervalKeys, IntervalTime } from "~~/types/IntervalMap";
import { ITradeCandle, ITradeShare } from "~~/types/Share";

export class TradeShare {
  dateCandles: Record<string, ITradeCandle> = {};
  candles = ref<ITradeCandle[]>([]);
  interval: IntervalKeys;
  figi: string;
  endDate = ref("");
  data = ref<(ITradeCandle | undefined)[]>([]);
  /* eslint-disable no-use-before-define */
  static shares: TradeShare[] = [];

  constructor(data: ITradeShare) {
    this.interval = data.interval;
    this.figi = data.figi;
    this.endDate.value = data.date;
    TradeShare.shares.push(this);
  }

  shiftEndDate(delta: number) {
    return new Date(
      +new Date(this.endDate.value) + delta * 1000 * 60
    ).toISOString();
  }

  getData(n: number) {
    const data = [...Array(n).keys()].map((i) => {
      const delta = i * IntervalTime[this.interval];
      const date = this.shiftEndDate(-delta);

      return this.dateCandles[date];
    });
    this.data.value = data;

    return data;
  }

  async getCandles(n: number) {
    const oneDay = 60 * 24;
    const delta = n * IntervalTime[this.interval] + oneDay;
    const startDate = this.shiftEndDate(-delta);
    const candles = (
      await useFetch(
        `/api/candles/${this.figi}/${this.interval}/${startDate}/db?end=${this.endDate.value}`
      )
    ).data;
    if (candles.value) {
      // TODO: figure out with SerializeObject type
      this.candles.value = (candles as unknown as Ref<Candles[]>).value;
      this.dateCandles = this.parseCandles();
    }
  }

  getTextureData() {
    const candleData = this.data.value;
    const width = this.data.value.length;
    const data = new Float32Array(width * 4);
    let high;
    let low;

    for (let i = 0; i < width; i++) {
      const candle = candleData[i];
      if (candle) {
        const shift = i * 4;
        data[shift] = candle.open;
        data[shift + 1] = candle.high;
        data[shift + 2] = candle.low;
        data[shift + 3] = candle.close;
        high = high ? Math.max(high, candle.high) : candle.high;
        low = low ? Math.min(low, candle.low) : candle.low;
      }
    }

    return { high, low, data };
  }

  parseCandles() {
    const data = this.candles.value;
    const res: Record<string, Candles> = {};

    data.reduce((res, d) => {
      res[new Date(d.time).toISOString()] = d;
      return res;
    }, res);

    return res;
  }

  addSum() {
    let sum = 0;
    this.candles.value.forEach((c) => {
      sum += c.close;
      c.closeSum = sum;
    });
  }

  addMA(n: number) {
    const candles = this.candles.value;
    if (candles[0] && !candles[0].closeSum) this.addSum();

    for (let i = 0; i < candles.length; i++) {
      const c = candles[i];
      const curSum = candles[i]?.closeSum;
      const prevSum = candles[i - n]?.closeSum;

      if (!c.ma) c.ma = {};
      c.ma[n] = curSum && prevSum ? (curSum - prevSum) / n : null;
    }
  }
}
