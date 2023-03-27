<template>
  <div @click="endInterval ? cacheNextCandles() : cacheFirstCandle()">
    {{ startInterval }} - {{ endInterval }}
  </div>
</template>

<script setup lang="ts">
import { IntervalKeys } from "~~/types/IntervalMap";

const props = defineProps<{
  figi: string;
  interval: IntervalKeys;
}>();
const datesDir = ["/api/candles", props.figi, props.interval].join("/");
const cache = (await useFetch(datesDir)).data;
const startDate = "2021-01-01";
const startInterval = ref("");
const endInterval = ref("");
if (Array.isArray(cache.value)) {
  startInterval.value = cache.value[0].split(".")[0];
  endInterval.value = cache.value.at(-1).split(".")[0];
}
const cacheNextCandles = async () => {
  const nextDate = new Date(+new Date(endInterval.value) + 1000 * 3600 * 24)
    .toISOString()
    .split("T")[0];
  await useFetch([datesDir, nextDate].join("/"));
  endInterval.value = nextDate;
};
const cacheFirstCandle = async () => {
  await useFetch([datesDir, startDate].join("/"));
  startInterval.value = startDate;
  endInterval.value = startDate;
};
</script>
