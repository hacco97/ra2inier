<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
   name: 'SearchBox',
   setup() {

      return {
      }
   }
})
</script>


<template>
   <div class="local-search">
      <h2><span v-svgicon="'icons/search.svg'"></span><span><input type="text"></span></h2>
      <li>搜素结果</li>
   </div>
</template>

<style scoped lang='scss'>
$height: 30px;

.local-search {

   height: $height;
}
</style>
