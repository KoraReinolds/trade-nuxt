import { TinkoffAPI } from "~~/classes/Tinkoff";

const api = new TinkoffAPI();

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) throw new Error("Id must be in 'id' query param");

  return await api.getAccountById(id);
});
