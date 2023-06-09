import { CandlesLoader, TinkoffInvestApi } from "tinkoff-invest-api";
import { GetCandlesRequest } from "tinkoff-invest-api/cjs/generated/marketdata";
import { Account } from "tinkoff-invest-api/cjs/generated/users";

export class TinkoffAPI {
  accounts: Account[] | undefined;
  account: Account | undefined;
  static cacheDir = ".cache";
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

  async getAccounts() {
    const { accounts } = await TinkoffAPI.api.users.getAccounts({});

    this.accounts = accounts;
    return accounts;
  }

  async getAccountById(id: string) {
    if (!this.accounts) this.accounts = await this.getAccounts();

    this.account = this.accounts.filter((acc) => acc.id === id)[0];
    return this.account;
  }

  async getCandles(params: GetCandlesRequest) {
    const candlesLoader = new CandlesLoader(TinkoffAPI.api, {
      cacheDir: TinkoffAPI.cacheDir,
    });
    try {
      return await candlesLoader.getCandles(params);
    } catch (err) {
      throw new Error("Get candles error");
    }
  }
}
