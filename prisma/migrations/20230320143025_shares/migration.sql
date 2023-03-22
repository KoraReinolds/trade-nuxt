-- CreateTable
CREATE TABLE "Shares" (
    "figi" TEXT NOT NULL,
    "ticker" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Shares_figi_key" ON "Shares"("figi");
