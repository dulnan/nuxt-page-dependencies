import { renderPageDependencies, useFooter } from '#imports'

function loadData(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Date.now().toString())
    }, 1000)
  })
}

export default async function (): Promise<string> {
  const data = await loadData()

  const { setNewsletterVisibility } = useFooter()
  setNewsletterVisibility(true)
  await renderPageDependencies()

  return data
}
