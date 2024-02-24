<script lang='ts' setup>
import { reactive } from 'vue';

import cllected from '@/asset/icons/cllected.svg?raw';
import { leftTabSize } from '@/states/layout';
import { LeftTab, starList, tabList } from '@/states/leftTabList';

import Addons from '../panel/panels/Addons.vue';
import Launcher from './tabs/Launcher.vue';
import Meta from './tabs/Meta/Index.vue';
import ProjRes from './tabs/ProjRes/Index.vue';
import Resource from './tabs/Resource.vue';
import Tutorial from './tabs/Tutorial.vue';

defineOptions({
   name: "LeftTab",
   components: { Resource, ProjRes, Addons, Tutorial, Launcher, Meta },
})

// 选择逻辑
const selected = reactive({
   id: tabList[0].id,
   type: tabList[0].type
})

function select(tab: LeftTab) {
   selected.id = tab.id
   selected.type = tab.type
}

function onTabClick(tab: LeftTab) {
   if (selected.id === tab.id) {
      if (leftTabSize.width === 0) {
         leftTabSize.width = leftTabSize.memory
      } else {
         leftTabSize.memory = leftTabSize.width
         leftTabSize.width = 0
      }
   }
   select(tab)
}

// 拖拽逻辑
let dragingTab: LeftTab;
function onTabDragStart(e: DragEvent, tab: LeftTab) {
   dragingTab = tab;
   e.dataTransfer?.setData('area', 'tab')
}

function onTabDragDrop(e: DragEvent, tab: LeftTab) {
   if (e.dataTransfer?.getData('area') !== 'tab') return
   const tmp = tab.order;
   if (dragingTab.order > tmp) {
      for (let t of tabList) {
         if (t.order >= tmp && t.order < dragingTab.order)
            t.order += 1;
      }
   }
   else if (dragingTab.order < tmp) {
      for (let t of tabList) {
         if (t.order > dragingTab.order && t.order <= tmp)
            t.order -= 1;
      }
   }
   dragingTab.order = tmp;
}


</script>


<template>
   <div id="lefttab" :class="$style.lefttab" class="clearfix">
      <ul class="scrollx normal-panel">
         <section></section>
         <ol>
            <li v-for="i in tabList" :key="i.id" :style="{ order: i.order }" @click="onTabClick(i)"
               :selected="selected.id === i.id" draggable="true" @dragstart="onTabDragStart($event, i)" @dragover.prevent
               @drop.stop="onTabDragDrop($event, i)" :class="$theme['lefttab-label']" class="lefttab-button">
               <div v-svgicon="i.label" padding="15%"></div>
            </li>
         </ol>
         <section></section>
         <ol>
            <li v-for="star in starList" :key="star.id" :class="$theme['lefttab-label']" class="lefttab-button">
               <a :href="star.url" :title="star.name" tabindex="-1">
                  <div v-svgicon="cllected" padding="15%"></div>
               </a>
            </li>
         </ol>
      </ul>
      <main :class="$theme['lefttab-panel']">
         <div id="leftpanel" :class="$style.panel">
            <KeepAlive>
               <component :is="selected.type" :key="selected.id"></component>
            </KeepAlive>
         </div>
      </main>
   </div>
</template>

<style src="@css/lefttab.scss" scoped module="$theme" />
<style lang='scss' scoped module>
$width: size(lefttab);

.lefttab {
   height: 100%;
   width: 100%;
   min-height: 0;

   >ul {
      float: left;
      height: 100%;
      width: $width;
      overflow-x: hidden;
      overflow-y: auto;
      min-height: 0;

      >ol {
         display: flex;
         flex-direction: column;
         min-height: 0;
      }

      >section {
         height: calc($width - size(menu));
      }

      li {
         height: $width;
         width: $width;
         overflow: hidden;
      }
   }

   >main {
      float: left;
      width: calc(100% - $width);
      height: 100%;
      overflow: hidden;
   }
}

.panel {
   width: 100%;
   height: 100%;
}
</style>
