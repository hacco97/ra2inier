<script lang="ts" setup>
import ContextMenu from '@/pages/contextmenu/Index.vue';
import Home from '@/pages/home/Index.vue';
import '@/components/FileLink'

import.meta.glob('@/css/global/**/*', { eager: true })
import.meta.glob('@/css/classes/**/*', { eager: true })
import { projectInfo, packages, allOfPackages } from '@/stores/projectStore'

const projectInfo_ = projectInfo
const packages_ = packages
const all_ = allOfPackages

document.body.addEventListener('contextmenu', (ev) => {
   ev.stopPropagation()
   ev.preventDefault()
})
</script>

<template>
   <ContextMenu />
   <Home />
</template>

<style lang="scss">
#app {
   height: 100vh;
   overflow: hidden;
   user-select: none;
   -webkit-user-select: none;
   -webkit-font-smoothing: antialiased;
   @include app-panel();

   *::selection {
      @include selection();
   }
}
</style>
