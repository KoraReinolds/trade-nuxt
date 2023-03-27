import { CandleInterval } from "tinkoff-invest-api/cjs/generated/marketdata";
import { Helpers } from "tinkoff-invest-api";
import { Prisma, PrismaClient } from "@prisma/client";
import { TinkoffAPI } from "~~/classes/Tinkoff";
import { IntervalKeys, IntervalMap } from "~~/types/IntervalMap";

const api = new TinkoffAPI();
const prisma = new PrismaClient();
const loadCandlesFromDB = async (data: Prisma.CandlesFindManyArgs) => {
  return await prisma.candles.findMany(data);
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const db = !!(query.db || false);
  const offset = (query.offset || "1d").toString();
  const params = event.context.params;
  const figi = params?.figi || "";
  const interval = params?.interval as IntervalKeys;
  const date = params?.date || "";
  const { from, to } = Helpers.fromTo(offset, new Date(date));

  if (db) {
    return {
      candles: await loadCandlesFromDB({
        where: {
          shares: figi,
          time: {
            lte: to,
            gte: from,
          },
        },
      }),
    };
  }

  return await api.getCandles({
    figi,
    interval: CandleInterval[IntervalMap[interval]],
    from,
    to,
  });
});
