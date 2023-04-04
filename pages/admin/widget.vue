<template>
  <div class="h-screen flex flex-col">
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
import { IntervalKeys } from "~~/types/IntervalMap";

const route = useRoute();
const cachedShares = (await useFetch("/api/candles")).data;
const interval: IntervalKeys = (route.query.route as IntervalKeys) || "15_min";
const date = (route.query.date as string) || "2022-01-01";
</script>
