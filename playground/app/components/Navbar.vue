<template>
  <nav class="navbar">
    <NuxtLink to="/">nuxt-page-dependencies</NuxtLink>
    <div>
      <ul class="navbar-menu">
        <li v-for="(link, i) in links" :key="i">
          <NuxtLink :to="link.url">{{ link.label }}</NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from '#imports'

const links = computed(() => {
  return [
    {
      url: '/info',
      label: 'Info',
    },
    {
      url: '/forms/contact',
      label: 'Contact us',
    },
    {
      url: '/forms/complain',
      label: 'Complain',
    },
    {
      url: '/trigger-page-error',
      label: 'Trigger page error',
    },
    {
      url: '/long-rendering',
      label: 'Long Rendering',
    },
    {
      url: '/trigger-page-error?triggerAppError=true',
      label: 'Trigger app.vue error',
    },
    {
      url: '/foobar?triggerPluginError=true',
      label: 'Trigger plugin error',
    },
  ]
})
</script>

<style>
.navbar {
  display: flex;
  border-bottom: 1px solid;
  padding: 20px 0;
  justify-content: space-between;
}

.navbar-menu {
  margin: 0;
  padding: 0;
  display: flex;
  list-style-type: none;
  gap: 30px;
}
.navbar-menu a {
  text-decoration: none;
  text-transform: uppercase;
  color: black;
  font-weight: bold;
}
</style>
