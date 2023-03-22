import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const saveShares = async (data: Prisma.SharesCreateManyInput) => {
  return await prisma.shares.createMany({ data });
};

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  return await saveShares(data);
});
