import { TinkoffInvestApi } from "tinkoff-invest-api";

export class TinkoffAPI {
  cacheDir = ".cache";
  static api: TinkoffInvestApi;

  constructor() {
    if (!TinkoffAPI.api) {
      const token = process.env.API_TOKEN;
      if (!token) throw new Error("Define API_TOKEN in .env file");
      TinkoffAPI.api = new TinkoffInvestApi({
        token,
      });
    }
  }
}
