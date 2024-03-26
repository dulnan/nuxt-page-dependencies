import { defineEventHandler, getQuery } from 'h3'

type BreadcrumbItem = {
  url: string
  label: string
}

type Page = {
  title: string
  newsletterVisible?: boolean
  languages: string[]
  breadcrumb: BreadcrumbItem[]
}

const pages: Record<string, Page> = {
  '/': {
    title: 'Homepage',
    newsletterVisible: true,
    languages: ['en', 'de', 'fr'],
    breadcrumb: [{ url: '/', label: 'Homepage' }],
  },

  '/forms': {
    title: 'Forms',
    newsletterVisible: true,
    languages: ['en', 'de', 'fr'],
    breadcrumb: [
      { url: '/', label: 'Homepage' },
      { url: '/forms', label: 'Forms' },
    ],
  },

  '/forms/contact': {
    title: 'Contact us now',
    languages: ['en'],
    breadcrumb: [
      { url: '/', label: 'Homepage' },
      { url: '/forms', label: 'Forms' },
      { url: '/forms/contact', label: 'Contact' },
    ],
  },

  '/forms/complain': {
    title: 'Complain about us now',
    languages: ['en'],
    breadcrumb: [
      { url: '/', label: 'Homepage' },
      { url: '/forms', label: 'Forms' },
      { url: '/forms/complain', label: 'Complain' },
    ],
  },

  '/info': {
    title: 'Info',
    newsletterVisible: true,
    languages: ['en', 'de', 'fr'],
    breadcrumb: [
      { url: '/', label: 'Homepage' },
      { url: '/info', label: 'Info' },
    ],
  },
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const path = query.path
  if (typeof path === 'string') {
    return pages[path]
  }
  return null
})
