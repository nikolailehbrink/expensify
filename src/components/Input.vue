<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <input
    v-model="model"
    class="border-2 px-2 text-sm rounded-md py-1 bg-neutral-50 placeholder:text-neutral-400"
  />
</template>
