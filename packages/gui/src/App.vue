<script lang="ts" setup>
import ContextMenu from '@/pages/contextmenu/Index.vue';
import Home from '@/pages/home/Index.vue';
import.meta.glob('@/css/global/**/*', { eager: true })
import.meta.glob('@/css/classes/**/*', { eager: true })
import '@/components/FileLink'
import { onMounted } from 'vue';
import { useThemeState } from './states/theme';

useThemeState()
onMounted(() => {
   document.body.addEventListener('contextmenu', (ev) => {
      ev.stopPropagation()
      ev.preventDefault()
   })
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
   @include font-family(normal);

   *::selection {
      @include selection();
   }
}
</style>
