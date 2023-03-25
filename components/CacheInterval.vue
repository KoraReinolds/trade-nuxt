<template>
  <div>{{ startInterval }} - {{ endInterval }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  figi: string;
  interval: "1_min" | "5_min" | "15_min ";
}>();

const cache = (
  await useFetch(["/api/shares/cache", props.figi, props.interval].join("/"))
).data;
const startInterval = ref("");
const endInterval = ref("");
if (Array.isArray(cache.value)) {
  startInterval.value = cache.value[0].split(".")[0];
  endInterval.value = cache.value.at(-1).split(".")[0];
}
</script>
