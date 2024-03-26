import type { HookResult } from '@nuxt/schema'
import { useNuxtApp } from '#imports'

/**
 * Call this once the page has finished setting up global state.
 */
export function renderPageDependencies() {
  const nuxtApp = useNuxtApp()
  nuxtApp._nuxtPageDependenciesRendered = true
  return nuxtApp.callHook('nuxt-page-dependencies:rendered')
}

declare module '#app' {
  interface RuntimeNuxtHooks {
    'nuxt-page-dependencies:rendered': () => HookResult
  }
}
