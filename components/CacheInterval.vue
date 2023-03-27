<template>
  <div>{{ startInterval }} - {{ endInterval }}</div>
</template>

<script setup lang="ts">
import { IntervalKeys } from "~~/types/IntervalMap";

const props = defineProps<{
  figi: string;
  interval: IntervalKeys;
}>();

const cache = (
  await useFetch(["/api/candles", props.figi, props.interval].join("/"))
).data;
const startInterval = ref("");
const endInterval = ref("");
if (Array.isArray(cache.value)) {
  startInterval.value = cache.value[0].split(".")[0];
  endInterval.value = cache.value.at(-1).split(".")[0];
}
</script>
