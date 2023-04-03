import { Helpers } from "tinkoff-invest-api";
import { CandleType, Prisma, PrismaClient } from "@prisma/client";
import { IntervalKeys, IntervalMap } from "~~/types/IntervalMap";

const prisma = new PrismaClient();
const loadCandlesFromDB = async (data: Prisma.CandlesFindManyArgs) => {
  return await prisma.candles.findMany(data);
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const offset = (query.offset || "1d").toString();
  const params = event.context.params;
  const figi = params?.figi || "";
  const interval = params?.interval as IntervalKeys;
  const date = params?.date || "";
  const { from, to } = Helpers.fromTo(offset, new Date(date));

  const candles = await loadCandlesFromDB({
    where: {
      shares: figi,
      type: CandleType[IntervalMap[interval]],
      time: {
        lte: to,
        gte: from,
      },
    },
    select: {
      low: true,
      high: true,
      open: true,
      close: true,
      time: true,
    },
  });
  return candles || [];
});
