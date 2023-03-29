<template>
  <div @click="saveCandles">{{ figi }} - {{ candles?.length }}</div>
</template>

<script setup lang="ts">
import { Candles } from ".prisma/client";
import { IntervalKeys } from "~~/types/IntervalMap";
import { TradeShare } from "~~/classes/Share";

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
if (candles) {
  // TODO: figure out with SerializeObject type
  const tradeShare = new TradeShare(candles as unknown as Candles[]);
  tradeShare.addMA(60);
}
const saveCandles = async () => {
  await useFetch(`/api/candles?figi=${props.figi}&interval=${props.interval}`, {
    method: "POST",
    body: candles,
  });
};
</script>
