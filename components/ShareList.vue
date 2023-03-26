<template>
  <div>
    <button v-if="!shares?.length" @click="parseShares">LoadShares</button>
    <div v-for="share in shares" :key="share.ticker" class="flex flex-row">
      <div class="w-20">{{ share.ticker }}</div>
      <div class="w-40">{{ share.figi }}</div>
      <CacheInterval class="w-60" interval="1_min" :figi="share.figi" />
      <CacheInterval class="w-60" interval="5_min" :figi="share.figi" />
      <CacheInterval class="w-60" interval="15_min" :figi="share.figi" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const props = defineProps<{
  figi?: string[];
}>();
const getShares = async () => {
  const sharesRes = await useFetch("/api/shares", {
    query: {
      skip: route.query.skip,
      take: route.query.take,
      figi: props.figi ? props.figi.join(",") : undefined,
    },
  });
  return sharesRes.data.value;
};

const shares = ref(await getShares());

const parseShares = async () => {
  const sharesRes = await useFetch("/api/shares/parse");
  const body = sharesRes.data.value;
  await useFetch("/api/shares", {
    method: "POST",
    body,
  });
  shares.value = await getShares();
};
</script>
