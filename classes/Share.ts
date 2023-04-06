import { IntervalKeys, IntervalTime } from "~~/types/IntervalMap";
import { ITradeCandle, ITradeShare } from "~~/types/Share";

export class TradeShare {
  dateCandles: Ref<Record<string, ITradeCandle>> = ref({});
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

      return this.dateCandles.value[date];
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

    const res = this.dateCandles.value;

    if (!candles.value) return res;

    candles.value.reduce((d, candle) => {
      const { time, ...rawCandle } = candle;
      d[new Date(time).toISOString()] = markRaw(rawCandle);
      return d;
    }, res);

    return res;
  }

  getTextureData() {
    const candleData = this.data.value;
    const width = this.data.value.length;
    const candles = new Float32Array(width * 4);
    let high;
    let low;

    for (let i = 0; i < width; i++) {
      const candle = candleData[i];
      if (candle) {
        const shift = i * 4;
        candles[shift] = candle.open;
        candles[shift + 1] = candle.high;
        candles[shift + 2] = candle.low;
        candles[shift + 3] = candle.close;
        high = high ? Math.max(high, candle.high) : candle.high;
        low = low ? Math.min(low, candle.low) : candle.low;
      }
    }

    const data = {
      candles,
    };

    return { high, low, data };
  }

  addSum() {
    let sum = 0;
    Object.values(this.dateCandles.value).forEach((c) => {
      sum += c.close;
      c.closeSum = sum;
    });
  }

  addMA(n: number) {
    const candles = Object.values(this.dateCandles.value);
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
