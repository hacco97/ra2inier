<script lang='ts' setup>
import sharpSvg from '@/asset/icons/sharp.svg?raw'
import { useCtxMenu } from '@/states/ctxMenu';


const vCtxmenu = useCtxMenu({
   '新建缩写'() {
      
   }
})

</script>


<template>
   <div :class="$style.snippet" v-ctxmenu>
      <h2 class="list-item">
         <p v-svgicon="sharpSvg" padding="15%"></p>
         <span>缩写</span>
      </h2>
      <ul>
         <li>snippet</li>
      </ul>
   </div>
</template>

<style module scoped lang='scss'>
.snippet {
   @import './meta.scss';
}
</style>
