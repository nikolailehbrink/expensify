<script setup lang="ts">
const model = defineModel()
</script>
<script lang="ts">
export const inputClasses =
  'border px-2 focus:outline-none focus:border-neutral-300 dark:focus:border-neutral-400 dark:focus:shadow-neutral-400 text-sm rounded-md py-1 bg-white shadow-bottom-2 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 dark:bg-neutral-900 dark:shadow-neutral-700 dark:border-neutral-700'
</script>

<template>
  <input v-model="model" :class="inputClasses" />
</template>
