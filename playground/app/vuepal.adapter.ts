import { defineVuepalAdapter } from '#vuepal/types'
import { useCurrentLanguage, useInitData } from '#imports'

export default defineVuepalAdapter(() => {
  return {
    getTranslations() {
      return useInitData().then((v) => v.translations.value)
    },
    getStaticNodes() {
      return useInitData().then((v) => v.staticNodes.value)
    },
    getAdminMenu() {
      return $fetch('/api/adminMenu').then((v) => v.data || {})
    },
    getLocalTasks() {
      return $fetch('/api/localTasks').then(
        (v) => v.data.route.localTasks || [],
      )
    },
    getCurrentLanguage() {
      return useCurrentLanguage()
    },
  }
})
