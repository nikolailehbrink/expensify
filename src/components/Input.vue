<script setup lang="ts">
const model = defineModel()
</script>

<template>
  <input
    v-model="model"
    class="border px-2 text-sm rounded-md py-1 bg-white border-b-2 placeholder:text-neutral-400"
  />
</template>
