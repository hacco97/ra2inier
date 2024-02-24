<script lang='ts' setup>
import closeSvg from '@/asset/icons/close.svg?raw';
import { drager, dragStart, DragType } from '@/states/drager';
import {
  closeTab, curPanel, panelList, PanelTab, selectTab,
} from '@/states/panelList';

import PanelLayout from './Layout.vue';
import API from './panels/API.vue';
import Debug from './panels/Debug.vue';
import MapperEditor from './panels/Meta/MapperEditor.vue';
import ScopeEditor from './panels/Meta/ScopeEditor.vue';
import WordViewer from './panels/Meta/WordViewer.vue';
import None from './panels/None.vue';
import ObjEditor from './panels/ObjEditor/Index.vue';
import ProjectInfo from './panels/ProjectInfo.vue';
import Setting from './panels/Setting.vue';
import Welcome from './panels/Welcome.vue';

defineOptions({
   name: 'Panel',
   components: {
      PanelLayout, Welcome, Debug, API, ProjectInfo, ObjEditor,
      None, ScopeEditor, WordViewer, MapperEditor, Setting
   },
})

// 选项卡逻辑
function tabClose(e: MouseEvent, id: number) {
   e.stopPropagation()
   e.preventDefault()
   closeTab(id)
}

// 选项卡拖动逻辑
function tabDragStart(e: DragEvent, tab: PanelTab) {
   dragStart(e, { type: DragType.PanelTab, data: tab })
}

function tabDragDrop(e: DragEvent, tab: PanelTab) {
   if (drager.type == DragType.PanelTab) {
      handleDragPanelTab(tab)
   }
}

function handleDragPanelTab(tab: PanelTab) {
   const tmp = tab.order;
   let dragingTab: PanelTab = drager.data
   if (dragingTab.order > tab.order) {
      for (let t of panelList) {
         if (t.position === dragingTab.position
            && t.order >= tab.order
            && t.order < dragingTab.order)
            t.order += 1;
      }
   } else if (dragingTab.order < tab.order) {
      for (let t of panelList) {
         if (t.position === dragingTab.position
            && t.order > dragingTab.order
            && t.order <= tab.order)
            t.order -= 1
      }
   }
   dragingTab.order = tmp
}

function getNavSlotName(tab: PanelTab) {
   const id = tab.position ? '1' : '2'
   return 'nav-' + id
}

function getMainSlotName(tab: PanelTab) {
   const id = tab.position ? '1' : '2'
   return 'main-' + id
}

</script>

<template>
   <PanelLayout>
      <template v-for="panel in curPanel" v-slot:[getNavSlotName(panel)]="slotProps" :key="panel.id">
         <ul class="panelnav" :class="[$style.navbox]">
            <li v-for="item in panelList" :key="item.id" :style="{ order: item.order }" draggable="true"
               @dragstart="tabDragStart($event, item)" @dragover.prevent @drop.stop="tabDragDrop($event, item)">
               <div v-if="item.position == slotProps.position && item.id > 0" :class="$theme['nav-label']"
                  :selected="panel.id === item.id" @click="selectTab(item)">
                  <b>{{ item.param.label }}</b>
                  <s @click="tabClose($event, item.id)" v-svgicon="closeSvg" class="fore-button"></s>
               </div>
            </li>
         </ul>
      </template>
      <template v-for="panel in curPanel" v-slot:[getMainSlotName(panel)] :key="panel.id">
         <KeepAlive>
            <component :is="panel.param.type" :param="panel.param" :key="panel.id" />
         </KeepAlive>
      </template>
   </PanelLayout>
</template>

<style src="@css/panel.scss" scoped module="$theme" />
<style lang='scss' scoped module>
$height: size(panelnav);
$buttun-size: clamp(14px, calc($height * 0.7), 30px);

.navbox {
   display: flex;
   align-items: center;
   height: $height;

   >li {
      min-width: fit-content;
      height: 100%;
      margin-left: 3px;
      overflow: hidden;

      >div {
         display: flex;
         align-items: center;
         width: fit-content;
         height: $height;
         padding: 0 1ch;
      }

      b {
         display: block;
         margin: 0 5px;
         width: fit-content;
      }

      s {
         display: block;
         width: $buttun-size;
         aspect-ratio: 1;
      }
   }
}
</style>
