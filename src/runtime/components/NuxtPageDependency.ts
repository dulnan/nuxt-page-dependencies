import { defineComponent } from 'vue'
import { useNuxtApp } from '#imports'

export default defineComponent({
  name: 'NuxtPageDependency',

  // Fixes "[Vue warn]: Extraneous non-props attributes (data-v-inspector)
  // were passed to component but could not be automatically inherited because
  // component renders fragment or text root nodes."
  inheritAttrs: false,

  setup(_props, ctx) {
    if (!ctx.slots.default) {
      return
    }

    // Renders the default slot.
    const renderSlot = function () {
      return ctx.slots.default!()
    }

    if (import.meta.server) {
      const nuxtApp = useNuxtApp()

      // We can early return without a promise in some cases.
      if (nuxtApp.payload.error || nuxtApp._nuxtPageDependenciesRendered) {
        return renderSlot
      }

      // Defer rendering the component until the page component has rendered.
      return new Promise(function (resolve) {
        const resolver = function () {
          resolve(renderSlot)
        }

        // If Nuxt has an error, immediately render the component.
        if (nuxtApp.payload.error || nuxtApp._nuxtPageDependenciesRendered) {
          return resolver()
        }

        // Called manually by using renderPageDependencies() composable.
        nuxtApp.hooks.hookOnce('nuxt-page-dependencies:rendered', resolver)

        // When any error happens, resolve.
        nuxtApp.hooks.hookOnce('app:error', resolver)
        nuxtApp.hooks.hookOnce('vue:error', resolver)
      })
    }

    return renderSlot
  },
})
