import getIntervalDirs from "../index.get";
import { TradeFileLoader } from "~~/classes/FileLoader";

const fl = new TradeFileLoader();

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  const interval = params?.interval;
  const intervalList = await getIntervalDirs(event);

  if (!(interval && intervalList.includes(interval))) {
    throw new Error("interval is not cached yet");
  }

  return await fl.getCachedFiles([params?.figi || "", params?.interval || ""]);
});
