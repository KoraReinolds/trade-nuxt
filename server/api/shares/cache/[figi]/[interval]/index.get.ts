import getIntervalDirs from "../index.get";
import { TinkoffAPI } from "~~/classes/Tinkoff";

const api = new TinkoffAPI();

export default defineEventHandler(async (event) => {
  const interval = event.context.params?.interval;
  const intervalList = await getIntervalDirs(event);

  if (!(interval && intervalList.includes(interval))) {
    throw new Error("interval is not cached yet");
  }

  return await api.getCachedFiles(event.path?.split("/").slice(-2));
});
