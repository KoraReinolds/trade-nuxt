<template>
  <div>
    <span @click="cacheCandles"> {{ startInterval }} </span>
    <span @click="saveCandles"> - {{ endInterval }} </span>
  </div>
</template>

<script setup lang="ts">
import { IntervalKeys } from "~~/types/IntervalMap";

const props = defineProps<{
  figi: string;
  interval: IntervalKeys;
}>();
const cache = (await useFetch(`/api/candles/${props.figi}/${props.interval}`))
  .data;
const startDate = "2021-01-01";
const startInterval = ref("");
const endInterval = ref("");
if (Array.isArray(cache.value)) {
  startInterval.value = cache.value[0]?.split(".")[0] || "";
  endInterval.value = cache.value.at(-1)?.split(".")[0] || "";
}
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};
const today = formatDate(new Date(Date.now()));
const cacheCandles = async () => {
  if (endInterval.value < today) {
    const nextDate = endInterval.value
      ? formatDate(new Date(+new Date(endInterval.value) + 1000 * 3600 * 24))
      : startDate;
    const res = await useFetch(
      `/api/candles/${props.figi}/${props.interval}/${nextDate}`
    );
    if (!res.error.value) {
      if (!startInterval.value) startInterval.value = startDate;
      endInterval.value = nextDate;
    }
    setTimeout(cacheCandles, res.error.value ? 60000 : 0);
  }
};

const saveCandles = async () => {
  const candles =
    (
      await useFetch(
        `/api/candles/${props.figi}/${props.interval}/${startInterval.value}?end=${endInterval.value}`
      )
    ).data.value?.candles || [];

  await useFetch(`/api/candles?figi=${props.figi}&interval=${props.interval}`, {
    method: "POST",
    body: candles,
  });
};
</script>
