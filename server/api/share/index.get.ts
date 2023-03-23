import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getShareByTicker(ticker: string) {
  const share = await prisma.shares.findFirst({
    where: {
      ticker,
      figi: {
        startsWith: "BBG",
      },
    },
  });

  if (!share) throw new Error("Share doesn't exist");

  return share;
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  if (typeof query.ticker !== "string")
    throw new Error("Pass ticker to request");
  return await getShareByTicker(query.ticker);
});
