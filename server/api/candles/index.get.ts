import { TradeFileLoader } from "~~/classes/FileLoader";

const fl = new TradeFileLoader();

export default defineEventHandler(async () => {
  return await fl.getCachedFiles();
});
