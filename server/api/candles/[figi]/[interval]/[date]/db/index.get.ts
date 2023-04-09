import { CandleType, Prisma, PrismaClient } from "@prisma/client";
import { eventParse } from "../index.get";
import { IntervalMap } from "~~/types/IntervalMap";

const prisma = new PrismaClient();
const loadCandlesFromDB = async (data: Prisma.CandlesFindManyArgs) => {
  return await prisma.candles.findMany(data);
};

export default defineEventHandler(async (event) => {
  const { figi, interval, dates } = eventParse(event);

  const candles = await loadCandlesFromDB({
    where: {
      shares: {
        in: figi.split(","),
      },
      type: CandleType[IntervalMap[interval]],
      time: {
        lte: dates.to,
        gte: dates.from,
      },
    },
    select: {
      low: true,
      high: true,
      open: true,
      close: true,
      time: true,
      id: true,
      shares: true,
    },
  });
  return candles || [];
});
