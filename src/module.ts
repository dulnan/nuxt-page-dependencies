import fs from 'fs'
import { name, version } from '../package.json'
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
   * Provide an array of strings to check custom composables instead.
   *
   * Note that this only checks the presence of the literal string in the
   * component file for performance reasons.
   */
  checkComposableCalled?: boolean | string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    configKey: 'pageDependencies',
    version,
    compatibility: {
      nuxt: '>=3.1.0',
    },
  },
  defaults: {
    checkComposableCalled: true,
  },
  setup(options) {
    const { resolve } = createResolver(import.meta.url)

    if (options.checkComposableCalled) {
      const validComposables: string[] = (
        typeof options.checkComposableCalled === 'boolean'
          ? ['renderPageDependencies']
          : options.checkComposableCalled
      ).map((v) => `${v}(`)

      function callsComposable(content: string): boolean {
        return validComposables.some((v) => content.includes(v))
      }
      const errorString = validComposables.map((v) => `"${v}"`).join(' or ')

      extendPages((pages) => {
        pages.forEach((page) => {
          if (!page.file) {
            return
          }

          fs.promises.readFile(page.file).then((contents) => {
            if (!callsComposable(contents.toString())) {
              throw new Error(
                `Page component "${page.file}" does not call the ${errorString} composable, which is required.`,
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
