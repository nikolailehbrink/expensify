<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div>
    <h1 class="mt-4 bg-red-500 font-bold">This is an about page, hallo</h1>
    <button @click="count++">Button count: {{ count }}</button>
  </div>
</template>
