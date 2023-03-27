/*
  Warnings:

  - The values [min_1,min_5,min_15,hour_1] on the enum `CandleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CandleType_new" AS ENUM ('CANDLE_INTERVAL_1_MIN', 'CANDLE_INTERVAL_5_MIN', 'CANDLE_INTERVAL_15_MIN');
ALTER TABLE "Candles" ALTER COLUMN "type" TYPE "CandleType_new" USING ("type"::text::"CandleType_new");
ALTER TYPE "CandleType" RENAME TO "CandleType_old";
ALTER TYPE "CandleType_new" RENAME TO "CandleType";
DROP TYPE "CandleType_old";
COMMIT;
