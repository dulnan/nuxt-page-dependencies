import fs from 'fs'
import {
  createResolver,
  defineNuxtModule,
  addComponent,
  addImports,
  extendPages,
} from '@nuxt/kit'

export type ModuleOptions = {
  /**
   * Checks that all page component files contain a call to the
   * renderPageDependencies() composable. If they don't contain it, the module
   * will throw an error.
   *
   * Note that this only checks the presence of the literal string in the
   * component file for performance reasons.
   */
  checkComposableCalled?: boolean
}

export type ModuleHooks = {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-page-dependencies',
    configKey: 'pageDependencies',
    version: '1.0.0',
    compatibility: {
      nuxt: '^3.1.0',
    },
  },
  defaults: {
    checkComposableCalled: true,
  },
  setup(options) {
    const { resolve } = createResolver(import.meta.url)

    if (options.checkComposableCalled) {
      extendPages((pages) => {
        pages.forEach((page) => {
          if (!page.file) {
            return
          }

          fs.promises.readFile(page.file).then((contents) => {
            if (!contents.toString().includes('renderPageDependencies()')) {
              throw new Error(
                `Page component "${page.file}" does not call the "renderPageDependencies" composable, which is required.`,
              )
            }
          })
        })
      })
    }

    addComponent({
      filePath: resolve('./runtime/components/NuxtPageDependency'),
      name: 'NuxtPageDependency',
      global: true,
    })

    addImports({
      from: resolve('./runtime/composables/renderPageDependencies'),
      name: 'renderPageDependencies',
    })
  },
})
