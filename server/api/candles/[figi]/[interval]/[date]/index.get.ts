import * as fs from "fs";
import * as path from "path";
import {
  HistoricCandle,
  CandleInterval,
} from "tinkoff-invest-api/cjs/generated/marketdata";
import { Helpers } from "tinkoff-invest-api";
import getDateDirs from "../index.get";
import { TinkoffAPI } from "~~/classes/Tinkoff";
import { IntervalKeys, IntervalMap } from "~~/types/IntervalMap";

const api = new TinkoffAPI();

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  const figi = params?.figi || "";
  const interval = params?.interval as IntervalKeys;
  const date = params?.date || "";
  const fileName = date + ".json";
  const dateList = await getDateDirs(event);

  if (dateList.includes(fileName)) {
    let res = "";
    const pathToFile = path.join(
      "./",
      api.cacheDir,
      "candles",
      figi,
      interval,
      fileName
    );
    return await new Promise((_resolve, _reject) =>
      fs
        .createReadStream(pathToFile)
        .on("data", (data: HistoricCandle) => {
          res += data;
        })
        .on("end", () => {
          _resolve(JSON.parse(res));
        })
        .on("error", (err) => {
          _reject(err);
        })
    );
  }

  return await api.getCandles({
    figi,
    interval: CandleInterval[IntervalMap[interval]],
    ...Helpers.fromTo("1d", new Date(date)),
  });
});
