import getFigiDirs from "../index.get";
import { TradeFileLoader } from "~~/classes/FileLoader";

const fl = new TradeFileLoader();

export default defineEventHandler(async (event) => {
  const figi = event.context.params?.figi;
  const figiList = await getFigiDirs(event);

  if (!(figi && figiList.includes(figi))) {
    throw new Error("shares with figi=" + figi + " is not found");
  }

  return await fl.getCachedFiles([figi]);
});
