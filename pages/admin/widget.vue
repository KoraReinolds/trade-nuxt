<template>
  <div>
    <CandlesInterval
      v-for="figi in cachedShares"
      :key="figi"
      :figi="figi"
      :offset="offset"
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
const date = (route.query.date as string) || "2021-01-01";
const offset = (route.query.offset as string) || "1w";
</script>
