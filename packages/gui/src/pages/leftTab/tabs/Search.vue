<script lang='ts' setup>
import searchSvg from '@/asset/icons/filter.svg?raw'
import { useFolder } from '@/hooks/folder'

const props = defineProps({
   placeholder: { type: String, default: '搜索' },
})

const { folded, vFolder } = useFolder()

</script>


<template>
   <aside :class="$style.search" class="normal-panel">
      <header>
         <span v-folder>&gt;</span>
         <s v-svgicon="searchSvg" padding="7%" @click="folded = !folded"></s>
         <input type="text" class="fore-input" :placeholder="placeholder">
      </header>
      <nav v-show="!folded" class="list-view">
         <li><span>类型</span><input class="fore-input" type="text"></li>
         <li><span>包</span></li>
      </nav>
   </aside>
</template>

<style module scoped lang='scss'>
.search {
   padding: 0 align-size(normal);

   input {
      flex: 1;
      padding: 0 align-size(normal);
      min-width: 0;
   }

   header {
      display: flex;
      height: 1lh;
      overflow: hidden;
      flex-wrap: nowrap;

      span {
         flex: 0 0 auto;
         min-width: fit-content;
      }
   }

   nav {
      li {
         display: flex;
         flex-wrap: nowrap;
      }

      input {
         flex: 1;
      }
   }
}
</style>
