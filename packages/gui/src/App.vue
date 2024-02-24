<script lang="ts" setup>
import Home from '@/pages/home/Index.vue'
import ContextMenu from '@/pages/contextmenu/Index.vue'
import.meta.glob('@/css/global/**/*', { eager: true })
import.meta.glob('@/css/classes/**/*', { eager: true })

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
