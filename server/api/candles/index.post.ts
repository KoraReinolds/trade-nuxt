import { Prisma, PrismaClient } from "@prisma/client";
import { Helpers } from "tinkoff-invest-api";
import { IntervalKeys, IntervalMap } from "~~/types/IntervalMap";

const prisma = new PrismaClient();

const saveCandles = async (data: Prisma.CandlesCreateManyInput[]) => {
  return await prisma.candles.createMany({
    data,
    skipDuplicates: true,
  });
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const query = await getQuery(event);
  const candleData: Prisma.CandlesCreateManyInput[] = body.map((data: any) => {
    const open = Helpers.toNumber(data.open);
    const close = Helpers.toNumber(data.close);
    const low = Helpers.toNumber(data.low);
    const high = Helpers.toNumber(data.high);
    const volume = data.volume;
    const shares = query.figi;
    const time = new Date(data.time);
    const interval = query.interval as IntervalKeys;
    const type = IntervalMap[interval];

    if (
      typeof volume !== "number" ||
      typeof shares !== "string" ||
      !open ||
      !close ||
      !low ||
      !high
    )
      throw new Error("Inclorrect data");

    const oneCandleData: Prisma.CandlesCreateManyInput = {
      open,
      low,
      high,
      close,
      volume,
      time,
      shares,
      type,
    };
    return oneCandleData;
  });

  return await saveCandles(candleData);
});
