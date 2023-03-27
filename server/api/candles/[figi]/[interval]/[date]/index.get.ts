import { CandleInterval } from "tinkoff-invest-api/cjs/generated/marketdata";
import { Helpers } from "tinkoff-invest-api";
import { TinkoffAPI } from "~~/classes/Tinkoff";
import { IntervalKeys, IntervalMap } from "~~/types/IntervalMap";

const api = new TinkoffAPI();

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  const figi = params?.figi || "";
  const interval = params?.interval as IntervalKeys;
  const date = params?.date || "";

  return await api.getCandles({
    figi,
    interval: CandleInterval[IntervalMap[interval]],
    ...Helpers.fromTo("1d", new Date(date)),
  });
});
