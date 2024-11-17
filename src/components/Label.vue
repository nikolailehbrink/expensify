<script setup lang="ts">
import { defineProps } from 'vue'
const props = defineProps<{ required?: boolean }>()
</script>

<template>
  <label class="text-sm font-bold text-neutral-900"
    ><slot></slot>
    <sup v-if="props.required" class="text-red-500 text-xs ml-0.5 -top-1">*</sup>
  </label>
</template>
