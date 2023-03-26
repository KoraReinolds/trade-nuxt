import * as fs from "fs";
import csv from "csv-parser";
import { Shares } from "@prisma/client";

let d: Shares[] = [];

const loadSharesToDb = () => {
  d = [];
  return new Promise<Shares[]>((_resolve) =>
    fs
      .createReadStream("./shares.csv")
      .pipe(csv())
      .on("data", (data: Shares) => {
        d.push({
          figi: data.figi,
          ticker: data.ticker,
        });
      })
      .on("end", () => {
        console.log("done: ", d.length);
        _resolve(d);
      })
  );
};
export default defineEventHandler(async () => {
  try {
    return await loadSharesToDb();
  } catch (err) {
    console.log(err);
  }
});
