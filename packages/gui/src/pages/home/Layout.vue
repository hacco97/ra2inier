<script lang="ts" setup>
import { ref } from 'vue';

import {
  ContextmenuType, showContextMenu, useCtxMenuInfo,
} from '@/states/ctxMenu';
import { footTabSize, leftTabSize, useMask } from '@/states/layout';
import { useConfig } from '@/stores/config';

//左侧拖拽逻辑
const display = ref(false)
const config = useConfig()

function onSideDrag(e: MouseEvent) {
   if (e.clientX < 140) {
      return leftTabSize.close()
   }
   leftTabSize.width = e.clientX
}

//右侧下边栏逻辑
const display2 = ref(false)
function onFootDragStart() {
   display2.value = true
   setTimeout(() => footTabSize.active = true)
}
function onFootDrag(e: MouseEvent) {
   // @ts-ignore
   const tmp = e.target.offsetParent, x = tmp.clientHeight - e.layerY
   if (isNaN(x)) return
   if (x < 100) footTabSize.min()
   else footTabSize.height = x
}

// 右键菜单逻辑
const { vCtxRoot } = useCtxMenuInfo()

const { isMasked } = useMask()
</script>

<template>
   <div id="home" :class="[$style.home]" :GPU="config.GPU" v-ctx-root>
      <!-- 顶部内容 -->
      <header>
         <div v-show="!isMasked">
            <slot name="header"></slot>
         </div>
      </header>

      <!-- 中间内容 -->
      <section>
         <!-- 左侧边 -->
         <aside :style="leftTabSize.widthS">
            <slot name="leftSide"></slot>
            <div :class="[$style.drager1, $theme['drager-hover']]">
               <p @mousedown="display = true"></p>
               <b v-show="display" @mousemove="onSideDrag" @mouseup="display = false" @mouseleave="display = false"></b>
            </div>
         </aside>
         <!-- 右侧主要内容区域 -->
         <main :class="$theme.panel" >
            <!-- 右下边栏 -->
            <aside :style="footTabSize.heightS">
               <slot name="footSide"></slot>
               <div :class="[$style.drager2, $theme['drager-hover']]" :dragging="display2">
                  <p @mousedown="onFootDragStart"></p>
               </div>
            </aside>
            <b :class="$style['drager2-panel']" v-show="display2" @mousemove="onFootDrag" @mouseleave="display2 = false"
               @mouseup="display2 = false"></b>
            <!-- 面板主体 -->
            <article id="main">
               <slot name="main"></slot>
            </article>
         </main>
      </section>

      <!-- 底部内容 -->
      <footer>
         <slot name="footer"></slot>
      </footer>
   </div>
</template>

<style scoped src="@css/panel.scss" module="$theme" />
<style scoped lang="scss" module>
$header-height: layout-size(menu);
$footer-height: layout-size(footer);

.home {
   display: flex;
   flex-direction: column;
   width: 100%;
   height: 100vh;
   min-height: 0;
   overflow: hidden;

   >header {
      position: relative;
      @include z-index(menu);
      flex: 0 0 $header-height;

      >div {
         height: 100%;
      }
   }

   >legend {
      position: relative;
      @include z-index(ctxmenu);
      flex: 0 0 0px;
      min-height: 0;
      overflow: visible;

      >div {
         position: relative;
         height: 0;
         overflow: visible;
      }
   }

   @import './section.scss';

   >footer {
      position: relative;
      @include z-index(footer);
      flex: 0 0 $footer-height;
   }
}

@import './drager.scss';
</style>
