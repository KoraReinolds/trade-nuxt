<template>
  <div>
    <button v-if="!shares?.length" @click="parseShares">LoadShares</button>
    <div v-for="share in shares" :key="share.ticker">
      <div>
        <span>{{ share.ticker }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const props = defineProps<{
  figi?: string[];
}>();

const parseShares = async () => {
  await useFetch("/api/shares", { method: "POST", body: shares });
};
const { data: shares } = await useFetch("/api/shares", {
  query: {
    skip: route.query.skip,
    take: route.query.take,
    figi: props.figi ? props.figi.join(",") : undefined,
  },
});
</script>
