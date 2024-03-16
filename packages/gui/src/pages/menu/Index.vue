<script lang='ts' setup>
import { computed, Directive, ref } from 'vue';

import closeSvg from '@/asset/icons/close.svg?raw';
import minSvg from '@/asset/icons/min.svg?raw';
import toggleSvg from '@/asset/icons/toggle.svg?raw';
import toggle2Svg from '@/asset/icons/toggle2.svg?raw';
import { on, send } from '@/boot/apis';
import { invokeMenuOption, menuList as list } from '@/states/menu';
import { projectName } from '@/stores/projectStore';

import CheckBox from './menuItem/CheckBox.vue';
import FileBox from './menuItem/FileBox.vue';
import { useScroller } from './scroll';

defineOptions({
   name: 'Menu',
   components: { FileBox, CheckBox }
})

const { scrolled, subLeft, makeScrollxer } = useScroller()

const vScrollx = {
   mounted: makeScrollxer
}

// 菜单逻辑
const show = ref(0)
const focused = ref(false)

const pName = computed(() => {
   return projectName.value || 'ra2 inier'
})

const onMenuClick = (i: number, j: number) => {
   invokeMenuOption(i, j)
}

// 窗口开闭逻辑
let maxed = ref(false)
function onToggleClick() {
   if (!maxed.value) {
      send('show-main-window')
   } else {
      send('orignal-main-window')
   }
}

function onHideClick() {
   send('hide-main-window')
}

function onCloseClick() {
   send('close-main-window')
}

on('maximize', () => {
   maxed.value = true
})

on('unmaximize', () => {
   maxed.value = false
})

</script>


<template>
   <ul id="menubar" tabindex="-1" :focused="focused" @blur="focused = false; show = -1" @focus=" focused = true"
      @click=" show = -1" :class="[$layout.menubar, $theme.menubar]">
      <!-- 图标 -->
      <h1 :class="$layout.icon">
         <div id="favicon"><a href="#" tabindex="-1"></a></div>
      </h1>
      <!-- 菜单 -->
      <section>
         <!-- 菜单按钮 -->
         <ul class="scrollx" v-scrollx @scroll="scrolled">
            <h2>
               <div v-for="i in list" :key="i.id" :class="[$layout['no-drag'], $theme['menubar-item']]">
                  <li @mouseover=" show = i.id" @click.stop>
                     <h3 class="vertical-center">{{ i.label }}</h3>
                  </li>
               </div>
            </h2>
         </ul>
         <!-- 下拉菜单选项 -->
         <ol :class="$layout['no-drag']">
            <div :style="{ left: subLeft }">
               <p v-for="item in list">
                  <li v-show="focused && show === item.id" :class="$theme['menubar-sublist']">
                     <em :class="$theme['menubar-subitem']" v-for="subItem in item.sub" :key="subItem.id"
                        @click="onMenuClick(item.id, subItem.id)">
                        <h4 :title="subItem.value">
                           <component v-if="subItem.component" :is="subItem.component" :label="subItem.label"
                              :value="subItem.value" />
                           <b v-else>{{ subItem.label }}</b>
                        </h4>
                     </em>
                  </li>
               </p>
            </div>
         </ol>
      </section>
      <!-- 标题 -->
      <b></b>
      <h1 :class="[$layout.title, $theme['menu-title']]">{{ pName }}</h1>
      <i></i>
      <!-- 窗口按键 -->
      <aside :class="[$layout['no-drag'], $theme['svg-icon']]">
         <q>
            <s v-svgicon="minSvg" @click="onHideClick"></s>
         </q>
         <q v-if="maxed">
            <s v-svgicon="toggleSvg" @click="onToggleClick"></s>
         </q>
         <q v-else>
            <s v-svgicon="toggle2Svg" @click="onToggleClick"></s>
         </q>
         <q :class="$theme['close-btn']">
            <s v-svgicon="closeSvg" @click="onCloseClick"></s>
         </q>
      </aside>
   </ul>
</template>

<style src="@css/menubar.scss" scoped module="$theme" />
<style scoped module="$layout" lang="scss">
$height: layout-size(menu);
$icon-length: layout-size(lefttab);

.menubar {
   display: flex;
   flex-wrap: nowrap;
   height: $height;
   -webkit-app-region: drag;

   &[focused=true] section {
      text-decoration: underline;
   }

   @import "./list.scss";

   >b {
      flex: 0 0 81px;
   }

   >i {
      flex: 2 1 0;
   }

   >aside {
      flex: 0;
      min-width: fit-content;
      overflow: visible;

      q {
         display: inline-block;
         height: $height;
         padding: 0 align-size(normal);
      }

      s {
         display: block;
         height: 100%;
         aspect-ratio: 1;
      }
   }
}

.icon {
   flex: 0 0 $icon-length;
   height: 100%;
   min-width: 0;

   div {
      display: block;
      position: relative;
      @include z-index(icon);
      top: 0;
      left: 0;
      height: $icon-length;
      width: $icon-length;
      border-radius: calc(($icon-length)/2); // speacial
      overflow: hidden;
      -webkit-user-drag: none;
      -webkit-app-region: drag;

      a {
         display: block;
         height: 100%;
         background: favicon(); // 提供改变图标背景的接口
      }
   }
}


.no-drag {
   -webkit-app-region: no-drag;
}

.title {
   flex: 1 1 0;
   height: 100%;
   overflow: visible;
   line-height: $height;
   text-align: center;
}
</style>
