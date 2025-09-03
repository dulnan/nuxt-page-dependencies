<template>
  <div>
    <ul class="breadcrumb">
      <li v-for="(link, i) in breadcrumbs" :key="i">
        <NuxtLink :to="link.url">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumb } from '#imports'

const { breadcrumbs } = useBreadcrumb()
</script>

<style>
.breadcrumb {
  display: flex;
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-top: 40px;
  margin-bottom: 100px;
}
.breadcrumb li:not(:last-child):after {
  content: '»';
  display: inline-block;
  margin: 0 20px;
}
</style>
