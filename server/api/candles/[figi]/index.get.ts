import getFigiDirs from "../index.get";
import { TinkoffAPI } from "~~/classes/Tinkoff";

const api = new TinkoffAPI();

export default defineEventHandler(async (event) => {
  const figi = event.context.params?.figi;
  const figiList = await getFigiDirs(event);

  if (!(figi && figiList.includes(figi))) {
    throw new Error("shares with figi=" + figi + " is not found");
  }

  return await api.getCachedFiles([figi]);
});
