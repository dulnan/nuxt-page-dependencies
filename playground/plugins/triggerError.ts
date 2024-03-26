import { defineNuxtPlugin, useRoute, createError } from '#imports'

export default defineNuxtPlugin(() => {
  const route = useRoute()

  if (route.query.triggerPluginError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error triggered in triggerError.ts plugin.',
      fatal: true,
    })
  }
})
