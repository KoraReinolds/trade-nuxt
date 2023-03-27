<template>
  <div>{{ figi }} - {{ candles?.length }}</div>
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
    `/api/candles/${props.figi}/${props.interval}/${props.date}?offset=${props.offset}`
  )
).data.value?.candles;
</script>
