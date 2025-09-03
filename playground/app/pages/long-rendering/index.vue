<template>
  <div>{{ data }}</div>
</template>

<script setup lang="ts">
import { customApiLoader, useAsyncData } from '#imports'

const { data } = await useAsyncData('long-rendering', () => {
  return customApiLoader()
})
</script>
