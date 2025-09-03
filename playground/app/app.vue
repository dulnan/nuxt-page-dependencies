<template>
  <div>
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <PageFooter />
  </div>
</template>

<script lang="ts" setup>
import { useRoute, createError } from '#imports'
const route = useRoute()

if (route.query.triggerAppError) {
  throw createError({
    statusCode: 500,
    statusMessage: 'Error triggered in app.vue',
    fatal: true,
  })
}
</script>

<style lang="css">
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}
</style>
