import { TinkoffAPI } from "~~/classes/Tinkoff";

export default defineEventHandler(async () => {
  const api = new TinkoffAPI();

  return await api.getCacheDirs();
});
