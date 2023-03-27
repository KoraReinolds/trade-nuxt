-- CreateEnum
CREATE TYPE "CandleType" AS ENUM ('min_1', 'min_5', 'min_15', 'hour_1');

-- CreateTable
CREATE TABLE "Candles" (
    "id" SERIAL NOT NULL,
    "type" "CandleType" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "low" DOUBLE PRECISION NOT NULL,
    "high" DOUBLE PRECISION NOT NULL,
    "open" DOUBLE PRECISION NOT NULL,
    "close" DOUBLE PRECISION NOT NULL,
    "volume" INTEGER NOT NULL,
    "shares" TEXT NOT NULL,

    CONSTRAINT "Candles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Candles_shares_time_type_key" ON "Candles"("shares", "time", "type");

-- AddForeignKey
ALTER TABLE "Candles" ADD CONSTRAINT "Candles_shares_fkey" FOREIGN KEY ("shares") REFERENCES "Shares"("figi") ON DELETE RESTRICT ON UPDATE CASCADE;
