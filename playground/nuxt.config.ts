export default defineNuxtConfig({
  ssr: true,
  modules: ['../src/module', '@nuxt/eslint'],

  imports: {
    autoImport: false,
  },

  pageDependencies: {
    checkComposableCalled: ['customApiLoader', 'renderPageDependencies'],
  },

  app: {
    head: {
      viewport:
        'width=device-width, height=device-height, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0',
    },
  },

  experimental: {
    asyncContext: true,
  },

  compatibilityDate: '2024-09-02',
})
