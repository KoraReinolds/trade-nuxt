import { TinkoffInvestApi } from "tinkoff-invest-api";
import { Account } from "tinkoff-invest-api/cjs/generated/users";

export class TinkoffAPI {
  cacheDir = ".cache";
  accounts: Account[] | null = null;
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
}
