<script lang='ts' setup>
import { ref } from 'vue';

import closeAllSvg from '@/asset/icons/closeAll.svg?raw';
import fullSvg from '@/asset/icons/full.svg?raw';
import leftArrowSvg from '@/asset/icons/leftArrows.svg?raw';
import rightArrowSvg from '@/asset/icons/rightArrows.svg?raw';
import { useMask } from '@/states/layout';
import { colseAllTabs } from '@/states/panelList';

defineOptions({ name: 'PanelLayout' })

// 左右拖动逻辑
const dragerIsShowed = ref(false)
const dragWidth = ref('100%')
const rightIsShowed = ref(false)


// 全屏化逻辑
const isFullScreen = ref(true)
const { show } = useMask(() => { isFullScreen.value = true })
function onFullScreenClick() {
   isFullScreen.value = false
   show()
}

function onCloseAll(pos: 'left' | 'right') {
   colseAllTabs(pos)
}

</script>


<template>
   <div :class="[$style.panel, $theme['panel-view']]" id="panel">
      <!-- 左半边 -->
      <section :class="$style.left" :style="{ flexBasis: dragWidth }">
         <nav :class="$theme['panel-nav']" class="panel-nav">
            <h2 class="scrollx clearfix" v-scrollx>
               <ul>
                  <slot name="nav-1" :position="true"></slot>
               </ul>
            </h2>
            <p :class="$theme['panelnav-btn']">
               <s padding="20%" v-svgicon="fullSvg" @click="onFullScreenClick"></s>
               <s padding="20%" v-svgicon="closeAllSvg" @click="onCloseAll('left')"></s>
               <s padding="20%" v-svgicon="rightArrowSvg" v-if="rightIsShowed"
                  @click="rightIsShowed = false; dragWidth = '100%'"></s>
               <s padding="15%" v-svgicon="leftArrowSvg" v-else @click="rightIsShowed = true"></s>
            </p>
         </nav>
         <main ref="lp">
            <Teleport to="#mask" :disabled="isFullScreen">
               <slot name="main-1"></slot>
            </Teleport>
         </main>
      </section>

      <!-- 拖动条 -->
      <q v-show="rightIsShowed" :class="$theme['panel-drager']">
         <p @mousedown="dragerIsShowed = true" :dragging="dragerIsShowed"></p>
      </q>
      <b v-show="dragerIsShowed" @mouseup="dragerIsShowed = false" @mouseleave="dragerIsShowed = false"
         @mousemove="dragWidth = $event.offsetX + 'px'"></b>

      <!-- 右半边 -->
      <section :class="$style.right" v-show="rightIsShowed">
         <nav :class="$theme['panel-nav']" class="panel-nav">
            <h2 class="scrollx clearfix" v-scrollx>
               <ul>
                  <slot name="nav-2" :position="false"></slot>
               </ul>
            </h2>
            <p :class="$theme['panelnav-btn']">
               <s padding="20%" v-svgicon="closeAllSvg"></s>
            </p>
         </nav>
         <main>
            <slot name="main-2"></slot>
         </main>
      </section>

   </div>
</template>

<style src="@css/panel.scss" scoped module="$theme" />
<style scoped lang='scss' module>
$height: layout-size(panelnav);

$z-index-nav:2;
$z-index-panel:1;


.left {
   flex: 0 1 100%;
   min-width: 200px;
   overflow: hidden;
}

.right {
   flex: 1 1 150px;
   min-width: 150px;
   overflow: hidden;
}

.panel {
   display: flex;
   width: 100%;
   height: 100%;
   overflow: hidden;
   position: relative;
   z-index: 0;
   line-height: line-height(normal);

   main {
      position: relative;
      z-index: $z-index-panel;
      height: calc(100% - $height);
      overflow: hidden;
      transition: all 1.5s ease-in-out;
   }

   // 导航条
   nav {
      position: relative;
      z-index: $z-index-nav;
      display: flex;
      height: $height;
      /* overflow: hidden; */

      >h2 {
         height: 100%;
         flex: 1 1 0;
         overflow-x: auto;
         overflow-y: hidden;

         >ul {
            height: 100%;
         }
      }

      >p {
         flex: 0 0 auto;
         display: flex;
         align-items: center;
         min-width: fit-content;
         height: 100%;
         padding: 0 align-size(normal);

         s {
            height: 100%;
            aspect-ratio: 1;
            margin: 0 align-size(tiny);
         }
      }
   }


   // 拖动条
   >q {
      flex: 0;
      display: block;
      position: relative;
      overflow: visible;
      cursor: ew-resize;

      p {
         position: absolute;
         top: 0;
         left: -4px;
         z-index: 1;
         width: 8px;
         height: 100%;
      }
   }

   >b {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      height: 100%;
      width: 100%;
      cursor: ew-resize;
   }
}
</style>
