# nuxt-page-dependencies

**Defer rendering of components that depend on page data during SSR**

This Nuxt 3 module implements a way to defer rendering of components (think
breadcrumbs, language links) outside of the tree of a page component until page
rendering is done.

The obvious solution would be to put all components that depend on page data
into the page component itself. But this would render them on every route
change, which is most likely not what we want.

## Setup

```bash
npm install --save nuxt-page-dependencies
```

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-page-dependencies'],
})
```

The module only has a single option called `checkComposableCalled`. If set to
true (default), it will check the contents of all page components to make sure
the composable is called.

## Usage

### Wrap components that need page data

```vue
<template>
  <NuxtPageDependency>
    <Breadcrumb />
  </NuxtPageDependency>
</template>
```

### Call composable to start rendering dependencies

```typescript
// Do stuff that mutates global state.

// Render <Breadcrumb>.
await renderPageDependencies()

// Done!
```

## The problem

Let's say you have a layout component in `layouts/default.vue`:

```vue
<template>
  <div class="default-layout">
    <Navbar />
    <Breadcrumb />
    <div>
      <slot></slot>
    </div>
  </div>
</template>
```

And this component that renders the current breadcrumb:

```vue
<template>
  <ul class="breadcrumb">
    <li v-for="(link, i) in breadcrumbs" :key="i">
      <NuxtLink :to="link.url">{{ link.label }}</NuxtLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { breadcrumbs } = useBreadcrumb()
</script>
```

And a page component like this:

```vue
<template>
  <div>
    <h1>{{ page?.title }}</h1>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { setBreadcrumbs } = useBreadcrumb()

const { data: page } = await useAsyncData(() => {
  return $fetch('/api/get-page', {
    query: {
      path: route.path,
    },
  })
})

setBreadcrumbs(page.value.breadcrumb)
</script>
```

This results in the following component tree (simplified):

```
- <App>
  - <Layout>
    - <Navbar>
    - <Breadcrumb>
    - <NuxtPage>
      - <YourPageComponent>
```

By default, the `<Breadcrumb>` component will display no breadcrumb, due to
`breadcrumbs` being empty. This is because the page component did not yet
render.

## The solution

The module provides a component called `<NuxtPageDependency>` that can be used
to wrap other components or parts of a template. It will only start rendering
its default slot once the page has finished rendering:

```vue
<template>
  <NuxtPageDependency>
    <ul class="breadcrumb">
      <li v-for="(link, i) in breadcrumbs" :key="i">
        <NuxtLink :to="link.url">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </NuxtPageDependency>
</template>

<script setup lang="ts">
const { breadcrumbs } = useBreadcrumb()
</script>
```

This also works for any part of a template, as can be seen in the example above.

Under the hood, the component returns a Promise in its setup() method and waits
for a specific event to be emitted. This event must always be emitted manually,
using the `renderPageDependencies()` composable:

```vue
<template>
  <div>
    <h1>{{ page?.title }}</h1>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { setBreadcrumbs } = useBreadcrumb()

const { data: page } = await useAsyncData(() => {
  return $fetch('/api/get-page', {
    query: {
      path: route.path,
    },
  })
})

// First update the state.
setBreadcrumbs(page.value.breadcrumb)

// Render the dependent components.
await renderPageDependencies()
</script>
```

## Custom composables

For the `checkComposableCalled` option you may also provide an array of
composable names to check, for example if you create your own composable that
fetches page data and sets global state and calls `renderPageDependencies`.

```typescript
export default defineNuxtConfig({
  modules: ['nuxt-page-dependencies'],
  pageDependencies: {
    checkComposableCalled: ['renderPageDependencies', 'loadPageData'],
  },
})
```

```typescript
export async function loadPageData(): Promise<PageData> {
  const route = useRoute()
  const data = await useFetch('/api/load-page-data', {
    query: {
      id: route.params.id,
    },
  })

  setBreadcrumbs(data.breadcrumbs)

  // Call the composable so that <NuxtPageDependency> components can be rendered.
  await renderPageDependencies()
}
```

```vue
<template>
  <div>
    <h1>{{ page?.title }}</h1>
  </div>
</template>

<script setup lang="ts">
const page = await loadPageData()
</script>
```

## The now introduced problem

Obviously, this is more of a workaround than a proper solution. It's also
dangerous: If you forget to call the `renderPageDependencies()` composable in a
page component, you will completely block SSR, because the Promise is never
resolved. While the `<NuxtPageDependency>` component does resolve the Promise
when there is already an error or when an error happens, it does not implement a
setTimeout() or any other mechanism to resolve the Promise. Make sure to not
forget calling the composable on every page!
