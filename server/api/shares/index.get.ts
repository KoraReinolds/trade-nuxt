import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const loadShares = async (where: Prisma.SharesWhereInput = {}) => {
  return await prisma.shares.findMany({ where });
};

export default defineEventHandler(async () => {
  return await loadShares();
});
