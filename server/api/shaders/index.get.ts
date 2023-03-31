import { TradeFileLoader } from "~~/classes/FileLoader";

const fl = new TradeFileLoader();

export default defineEventHandler(() => {
  return fl.getShaders();
});
