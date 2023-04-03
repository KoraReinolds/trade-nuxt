import { CandleInterval } from "tinkoff-invest-api/cjs/generated/marketdata";
import { Helpers } from "tinkoff-invest-api";
import { TinkoffAPI } from "~~/classes/Tinkoff";
import { IntervalKeys, IntervalMap } from "~~/types/IntervalMap";

const api = new TinkoffAPI();

export const eventParse = (event: any) => {
  const query = getQuery(event);
  const offset = (query.offset || "1d").toString();
  const params = event.context.params;
  const figi = params?.figi || "";
  const interval = params?.interval as IntervalKeys;
  const date = params?.date || "";
  let dates: { to: Date | undefined; from: Date | undefined } = {
    to: undefined,
    from: undefined,
  };
  if (query.end) {
    dates = {
      from: new Date(date),
      to: new Date(query.end.toString() || ""),
    };
  } else {
    dates = Helpers.fromTo(offset, new Date(date));
  }
  return { figi, interval, dates };
};

export default defineEventHandler(async (event) => {
  const { figi, interval, dates } = eventParse(event);

  return await api.getCandles({
    figi,
    interval: CandleInterval[IntervalMap[interval]],
    ...dates,
  });
});
