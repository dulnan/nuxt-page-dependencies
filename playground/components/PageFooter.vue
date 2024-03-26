<template>
  <footer>
    <div>nuxt-page-dependencies</div>

    <NuxtPageDependency>
      <div v-if="showNewsletter">
        <button>Sign up for our newsletter!</button>
      </div>
    </NuxtPageDependency>
  </footer>
</template>

<script lang="ts" setup>
import { useFooter } from '#imports'
const { showNewsletter } = useFooter()
</script>

<style>
footer {
  background: #eee;
  min-height: 20vh;
  padding: 30px;
  display: flex;
  justify-content: space-between;
}

footer button {
  background: black;
  color: white;
  appearance: none;
  padding: 20px;
  border: 0;
}
</style>
