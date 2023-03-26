import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteShares = async () => {
  return await prisma.shares.deleteMany();
};

export default defineEventHandler(async () => {
  return await deleteShares();
});
