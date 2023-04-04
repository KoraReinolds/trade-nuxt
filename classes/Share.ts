import { Candles } from "@prisma/client";
import { IntervalKeys, IntervalTime } from "~~/types/IntervalMap";
import { ITradeCandle, ITradeShare } from "~~/types/Share";

export class TradeShare {
  dateCandles: Record<string, ITradeCandle> = {};
  candles = ref<ITradeCandle[]>([]);
  size = computed(() => this.candles.value.length);
  interval: IntervalKeys;
  figi: string;
  startDate: string;

  constructor(data: ITradeShare) {
    this.interval = data.interval;
    this.figi = data.figi;
    this.startDate = data.startDate;
  }

  async getCandles(n: number) {
    const oneDay = 1000 * 60 * 60 * 24;
    const delta = n * IntervalTime[this.interval] * 1000 * 60 + oneDay;
    const endDate = new Date(+new Date(this.startDate) + delta)
      .toISOString()
      .split("T")[0];
    const candles = (
      await useFetch(
        `/api/candles/${this.figi}/${this.interval}/${this.startDate}/db?end=${endDate}`
      )
    ).data;
    if (candles.value) {
      // TODO: figure out with SerializeObject type
      this.candles.value = (candles as unknown as Ref<Candles[]>).value;
      this.dateCandles = this.parseCandles();
    }
  }

  getTextureData() {
    const candleData = this.candles.value;
    const numCandles = this.candles.value.length;
    const width = numCandles + 1;
    const height = 4;
    const data = new Float32Array(width * height);
    let high;
    let low;

    for (let i = 0; i < numCandles; i++) {
      data[i * height] = candleData[i].open;
      data[i * height + 1] = candleData[i].high;
      data[i * height + 2] = candleData[i].low;
      data[i * height + 3] = candleData[i].close;
      high = high ? Math.max(high, candleData[i].high) : candleData[i].high;
      low = low ? Math.min(low, candleData[i].low) : candleData[i].low;
    }

    return { high, low, data };
  }

  parseCandles() {
    const data = this.candles.value;
    const res: Record<string, Candles> = {};

    data.reduce((res, d) => {
      res[d.time.toString()] = d;
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
