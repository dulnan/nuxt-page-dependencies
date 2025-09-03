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
  setup(options, nuxt) {
    const isDev = nuxt.options.dev
    const { resolve } = createResolver(import.meta.url)

    addComponent({
      filePath: resolve('./runtime/components/NuxtPageDependency'),
      name: 'NuxtPageDependency',
      global: true,
    })

    addImports({
      from: resolve('./runtime/composables/renderPageDependencies'),
      name: 'renderPageDependencies',
    })

    if (!options.checkComposableCalled) {
      return
    }

    // The valid composables. By default only `renderPageDependencies` is allowed.
    const validComposables: string[] =
      typeof options.checkComposableCalled === 'boolean'
        ? ['renderPageDependencies']
        : options.checkComposableCalled

    const errorString = validComposables.map((v) => `"${v}"`).join(' or ')
    const validComposableStrings = validComposables.map((v) => `${v}(`)

    function callsComposable(content: string): boolean {
      return validComposableStrings.some((v) => content.includes(v))
    }

    // Keep track of the pages we need to check.
    const checkedPages = new Set<string>()

    extendPages(async (pages) => {
      const results = await Promise.all(
        pages.map(async (page) => {
          if (!page.file) {
            return
          }

          if (checkedPages.has(page.file)) {
            return
          }

          try {
            const contents = await fs.promises
              .readFile(page.file)
              .then((v) => v.toString().trim())

            const isValid = contents.length === 0 || callsComposable(contents)

            if (isValid) {
              checkedPages.add(page.file)
              return
            }

            return `Page component "${page.file}" does not call the ${errorString} composable, which is required.`
          } catch (e) {
            if (isDev) {
              return
            }

            throw e
          }
        }),
      )

      const message = results.filter(Boolean).join('\n')
      if (!message) {
        return
      }

      console.error(`[nuxt-page-dependencies] - ${message}`)

      if (isDev) {
        return
      }

      throw new Error(
        `Can not build because not all page components await page dependencies.`,
      )
    })

    if (isDev) {
      nuxt.hook('builder:watch', async (_event, path) => {
        if (path.includes('.vue')) {
          // Force reloading of page component file contents.
          checkedPages.delete(path)
        }
      })
    }
  },
})
