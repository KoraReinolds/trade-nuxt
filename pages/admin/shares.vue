<template>
  <div>
    <ShareList :figi="cachedShares || []" />
  </div>
</template>

<script setup lang="ts">
const cachedShares = ref((await useFetch("/api/shares/cache")).data);
</script>
