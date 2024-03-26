import { useState, computed } from '#imports'

type Footer = {
  showNewsletter: boolean
}

export default function () {
  const data = useState<Footer>('footer', () => {
    return {
      showNewsletter: false,
    }
  })

  const setNewsletterVisibility = (visible: boolean | undefined | null) => {
    data.value.showNewsletter = !!visible
  }

  const showNewsletter = computed(() => data.value.showNewsletter)

  return { showNewsletter, setNewsletterVisibility }
}
