<template>
  <div>
    {{ shares.length }}
  </div>
</template>

<script setup lang="ts">
const shares = ref(await $fetch("/api/shares"));
console.log(shares.value);
</script>
