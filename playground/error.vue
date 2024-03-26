<template>
  <div>
    <NuxtLayout>
      <h1>{{ error.statusMessage || error.message }}</h1>
      <div>{{ error.stack }}</div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
type ErrorObject = {
  url?: string
  statusCode?: number
  statusMessage?: string
  message?: string
  stack?: string
}
const props = defineProps<{
  error: ErrorObject
}>()
</script>
