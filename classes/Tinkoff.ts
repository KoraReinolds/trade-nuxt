import * as fs from "fs";
import * as path from "path";
import { TinkoffInvestApi } from "tinkoff-invest-api";
import { Account } from "tinkoff-invest-api/cjs/generated/users";

export class TinkoffAPI {
  cacheDir = ".cache";
  accounts: Account[] | undefined;
  account: Account | undefined;
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

  async getCacheDirs() {
    const files = await fs.promises.readdir(
      path.join(this.cacheDir, "candles")
    );
    return files;
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
}
