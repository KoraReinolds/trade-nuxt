<template>
  <div @click="saveCandles">{{ figi }} - {{ candles?.length }}</div>
</template>

<script setup lang="ts">
import { IntervalKeys } from "~~/types/IntervalMap";

const props = defineProps<{
  figi: string;
  date: string;
  interval: IntervalKeys;
  offset: string;
}>();

const candles = (
  await useFetch(
    `/api/candles/${props.figi}/${props.interval}/${props.date}/db?offset=${props.offset}`
  )
).data.value?.candles;
const saveCandles = async () => {
  await useFetch(`/api/candles?figi=${props.figi}&interval=${props.interval}`, {
    method: "POST",
    body: candles,
  });
};
</script>
