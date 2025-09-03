import { useState, computed } from '#imports'

type BreadcrumbItem = {
  url: string
  label: string
}

export default function () {
  const data = useState<BreadcrumbItem[]>('breadcrumb', () => [])

  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    data.value = items
  }

  const breadcrumbs = computed(() => data.value)

  return { breadcrumbs, setBreadcrumbs }
}
