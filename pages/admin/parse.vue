<template>
  <div>
    {{ shares.length }}
    <button v-if="!shares.length" @click="parseShares">LoadShares</button>
  </div>
</template>

<script setup lang="ts">
const parseShares = async () => {
  const { data: shares } = await useFetch("/api/shares/parse");
  await useFetch("/api/shares", { method: "POST", body: shares });
};
const { data: shares } = await useFetch("/api/shares");
console.log(shares.value);
</script>
