import { Candles } from "@prisma/client";

interface ITradeCandle extends Candles {
  closeSum?: number;
  ma?: Record<number, number | null>;
}

export class TradeShare {
  dateCandles: Record<string, ITradeCandle>;
  candles: ITradeCandle[];

  constructor(data: Candles[]) {
    this.candles = data;
    this.dateCandles = this.parseCandles(data);
  }

  getTextureData() {
    const candleData = this.candles;
    const numCandles = this.candles.length;
    const width = numCandles;
    const height = 4;
    const data = new Float32Array(width * height);

    for (let i = 0; i < numCandles; i++) {
      data[i * height] = candleData[i].open;
      data[i * height + 1] = candleData[i].high;
      data[i * height + 2] = candleData[i].low;
      data[i * height + 3] = candleData[i].close;
    }

    return data;
  }

  parseCandles(data: Candles[]) {
    const res: Record<string, Candles> = {};

    data.reduce((res, d) => {
      res[d.time.toString()] = d;
      return res;
    }, res);

    return res;
  }

  addSum() {
    let sum = 0;
    this.candles.forEach((c) => {
      sum += c.close;
      c.closeSum = sum;
    });
  }

  addMA(n: number) {
    if (this.candles[0] && !this.candles[0].closeSum) this.addSum();

    for (let i = 0; i < this.candles.length; i++) {
      const c = this.candles[i];
      const curSum = this.candles[i]?.closeSum;
      const prevSum = this.candles[i - n]?.closeSum;

      if (!c.ma) c.ma = {};
      c.ma[n] = curSum && prevSum ? (curSum - prevSum) / n : null;
    }
  }
}
