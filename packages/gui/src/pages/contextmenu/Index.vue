<script lang='ts' setup>
import { reactive, ref } from 'vue';

import closeSvg from '@/asset/icons/close.svg?raw';
import { useCtxMenuInfo } from '@/states/ctxMenu';
import { closeMask, useMask } from '@/states/layout';

defineOptions({ name: 'ContextMenu' })

const { isCtxMenuShowed, ctxMenuPostion, ctxMemuItems, vCtxmenu } = useCtxMenuInfo()

const { isMasked } = useMask()

const wavePosition = reactive({ translate: '100px 100px' })
document.body.addEventListener('click', (e: MouseEvent) => {
   wavePosition.translate = `${e.clientX}px ${e.clientY}px`
})

</script>


<template>
   <div id="mask" :class="[$style.mask, $theme.mask]" v-show="isMasked">
      <s v-svgicon="closeSvg" class="fore-button" @click="closeMask"></s>
   </div>
   <!-- <li :class="$style.radius" :style="wavePosition"><span></span></li> -->
   <ul id="contextMenu" v-ctxmenu :class="[$style['context-menu'], $theme['context-menu']]" class="scrollx normal-panel"
      v-show="isCtxMenuShowed" :style="ctxMenuPostion">
      <li v-for="item in ctxMemuItems" @click="item.callback" v-show="item.enabled" class="fore-panel reactive-hc">
         {{ item.label }}
      </li>
   </ul>
</template>

<style scoped src="@css/ctx-menu.scss" module="$theme" />
<style scoped>
.showed-mask {
   height: 100vh !important;
}
</style>
<style scoped lang='scss' module>
.context-menu {
   position: absolute;
   top: 0;
   left: 0;
   @include z-index(ctxmenu);
   height: fit-content;
   width: fit-content;
   padding: 1em 0;
   max-width: 20em;
   overflow-x: auto;
   overflow-y: hidden;

   li {
      padding: 0.5ch 1em;
   }
}


.mask {
   display: block;
   position: absolute;
   @include z-index(mask);
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   overflow: hidden;

   s {
      display: block;
      position: absolute;
      @include z-index(mask);
      right: 1em;
      top: 1em;
      width: 3ch;
      height: 3ch;
   }
}


@keyframes wave {
   from {
      width: 2px;
      height: 2px;
      opacity: 1;
   }

   to {
      width: 40px;
      height: 40px;
      opacity: 0;
   }
}

.radius {
   position: absolute;
   @include z-index(mask);
   width: 0;
   height: 0;
   overflow: visible;
   pointer-events: none;

   span {
      display: block;
      border-radius: 50%;
      background-color: red;
      translate: -50% -50%;
      animation: wave 1s ease-out;
      visibility: hidden;
   }
}
</style>
