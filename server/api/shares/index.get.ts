import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const loadShares = async (params: Prisma.SharesFindManyArgs) => {
  return await prisma.shares.findMany(params);
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const { figi, skip, take } = query;
  const loadSharesReq: Prisma.SharesFindManyArgs = {
    where: {},
  };

  if (take && typeof +take === "number") loadSharesReq.take = +take;
  if (skip && typeof +skip === "number") loadSharesReq.skip = +skip;
  if (typeof figi === "string") {
    loadSharesReq.where = { figi: { in: figi.split(",") } };
  }

  return await loadShares(loadSharesReq);
});
