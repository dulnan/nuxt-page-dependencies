<template>
  <div class="default-layout">
    <Navbar />
    <NuxtPageDependency>
      <Breadcrumb />
    </NuxtPageDependency>
    <div>
      <slot />
    </div>
  </div>
</template>

<style lang="css">
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

.default-layout {
  max-width: 1440px;
  margin: 0 auto;
  min-height: 80vh;
}
</style>
