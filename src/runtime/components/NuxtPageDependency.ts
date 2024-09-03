import { defineComponent } from 'vue'
import { useSlots, useNuxtApp, useError } from '#imports'

export default defineComponent({
  name: 'NuxtPageDependency',

  // Fixes "[Vue warn]: Extraneous non-props attributes (data-v-inspector) were passed to component but could not be automatically inherited because component renders fragment or text root nodes."
  inheritAttrs: false,

  setup() {
    const slots = useSlots()
    if (!slots.default) {
      return
    }

    const nuxtApp = useNuxtApp()

    if (import.meta.server) {
      const error = useError()

      // Defer rendering the component until the page component has rendered.
      return new Promise((resolve) => {
        const resolver = () => {
          resolve(() => slots.default!())
        }

        // If Nuxt has an error, immediately render the component.
        if (error.value) {
          return resolver()
        }

        if (nuxtApp._nuxtPageDependenciesRendered) {
          return resolver()
        }

        // Called manually by using renderPageDependencies() composable.
        nuxtApp.hooks.hookOnce('nuxt-page-dependencies:rendered', resolver)

        // When any error happens, resolve.
        nuxtApp.hooks.hookOnce('app:error', resolver)
        nuxtApp.hooks.hookOnce('vue:error', resolver)
      })
    }

    return () => slots.default!()
  },
})
