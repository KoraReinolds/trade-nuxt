<template>
  <div
    class="h-screen flex flex-col"
    @auxclick="shiftEndDate(-oneDay)"
    @click="shiftEndDate(oneDay)"
  >
    <CandlesInterval
      v-for="figi in cachedShares"
      :key="figi"
      class="flex-grow h-full border-b border-gray-500"
      :figi="figi.toString()"
      :style="{ height: `${100 / (cachedShares?.length || 1)}%` }"
      :date="date"
      :interval="interval"
    />
  </div>
</template>

<script setup lang="ts">
import { IndexedDB } from "~~/classes/IndexedDB";
import { TradeShare } from "~~/classes/Share";
import { Widget } from "~~/classes/Widget";
import { IntervalKeys, IntervalTime } from "~~/types/IntervalMap";

const route = useRoute();
const cachedShares = (await useFetch("/api/candles")).data;
const interval: IntervalKeys = (route.query.route as IntervalKeys) || "15_min";
const date = (route.query.date as string) || "2022-01-01";
const oneDay = 24 * 60;
Widget.dataSize = oneDay / IntervalTime[interval];

const shiftEndDate = (delta: number) => {
  TradeShare.shares.forEach((tradeShare) => {
    tradeShare.endDate.value = tradeShare.shiftEndDate(delta);
  });
};

if (process.client) {
  const db = new IndexedDB();
  await db.init();

  const res = await db.searchByIndex(
    "time",
    IDBKeyRange.bound("2021-01-01T04:00:00.000Z", "2022-01-01T06:15:00.000Z")
  );
  console.log(res);
}
</script>
