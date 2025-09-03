<template>
  <div>
    <h1>{{ page?.title }}</h1>
  </div>
</template>

<script setup lang="ts">
import {
  renderPageDependencies,
  useRoute,
  useAsyncData,
  createError,
  useBreadcrumb,
  useFooter,
} from '#imports'

const route = useRoute()
const { setBreadcrumbs } = useBreadcrumb()
const { setNewsletterVisibility } = useFooter()

const { data: page } = await useAsyncData(route.path, () => {
  return $fetch('/api/get-page', {
    query: {
      path: route.path,
    },
  })
})

if (!page.value) {
  throw createError({ statusCode: 404, fatal: true })
}

setBreadcrumbs(page.value.breadcrumb)
setNewsletterVisibility(page.value.newsletterVisible)

await renderPageDependencies()
</script>
