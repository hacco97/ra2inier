<script lang='ts' setup>
import closeSvg from '@/asset/icons/close.svg?raw';
import { drager, dragStart, DragType } from '@/states/drager';
import {
   closeTab, curPanel, panelList, PanelTab, selectTab,
} from '@/states/panelList';
import { useConfigStore } from '@/stores/config';

import PanelLayout from './Layout.vue';
import API from './panels/API.vue';
import Debug from './panels/Debug.vue';
import MapperEditor from './panels/Meta/MapperEditor.vue';
import ScopeEditor from './panels/Meta/ScopeEditor.vue';
import WordEditor from './panels/Meta/WordEditor.vue';
import NewProject from './panels/NewProject.vue';
import None from './panels/None.vue';
import ObjectEditor from './panels/ObjectEditor/Index.vue';
import ObjectViewer from './panels/ObjectEditor/ObjectViewer.vue';
import ProjectInfo from './panels/ProjectInfo/Index.vue';
import Setting from './panels/Setting.vue';
import Welcome from './panels/Welcome.vue';

defineOptions({
   name: 'Panel',
   components: {
      PanelLayout, Welcome, Debug, API, ProjectInfo,
      ObjectEditor, None, ScopeEditor, WordEditor,
      MapperEditor, Setting, NewProject, ObjectViewer
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

const { config } = useConfigStore()

</script>

<template>
   <PanelLayout>
      <template v-for="panel in curPanel" v-slot:[getNavSlotName(panel)]="slotProps" :key="panel.id">
         <ul class="panel-nav" :class="[$style.navbox]">
            <li v-for="item in panelList" :key="item.id" :style="{ order: item.order }" draggable="true"
               @dragstart="tabDragStart($event, item)" @dragover.prevent @drop.stop="tabDragDrop($event, item)">
               <div v-if="item.position == slotProps.position && item.id > 0" :class="$theme['nav-label']"
                  :selected="panel.id === item.id" @click="selectTab(item)">
                  <b>{{ item.param.label }}</b>
                  <s @click="tabClose($event, item.id)" v-svgicon="closeSvg" :class="$theme['nav-close']"></s>
               </div>
            </li>
         </ul>
      </template>

      <template v-for="panel in curPanel" v-slot:[getMainSlotName(panel)] :key="panel.id">
         <KeepAlive :max="config.MAX_TAB_AMOUNT">
            <component :is="panel.param.type" :param="panel.param" :key="panel.id" />
         </KeepAlive>
      </template>
   </PanelLayout>
</template>

<style src="@css/panel.scss" scoped module="$theme" />

<style lang='scss' scoped module>
$height: layout-size(panelnav);
$buttun-size: clamp(14px, calc($height * 0.7), align-size(larger));

.navbox {
   display: flex;
   align-items: center;
   height: $height;

   >li {
      min-width: fit-content;
      height: 100%;
      margin-left: align-size(tiny);
      overflow: hidden;

      >div {
         display: flex;
         align-items: center;
         width: fit-content;
         height: $height;
         padding: 0 align-size(normal);
      }

      b {
         display: block;
         margin: 0 align-size(small);
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
