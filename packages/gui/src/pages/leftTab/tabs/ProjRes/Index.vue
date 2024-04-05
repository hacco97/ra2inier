<script lang='ts' setup>
import LeftTabLayout from '../Layout.vue';
import { usePanelHeight } from './panelHeight';
import PkgView from './PkgView.vue';
import { isEmptyObject } from '@ra2inier/core';
import Search from '@/pages/leftTab/tabs/Search.vue';
import { openProjectFromBrowser, useProjectStore } from '@/stores/projectStore';
import { LazyButton } from '@ra2inier/wc';
import dirSvg from '@/asset/icons/openDir.svg?raw'
import newSvg from '@/asset/icons/new.svg?raw';
import { PanelParam, PanelType, usePanelState } from '@/states/panelList';

const store = useProjectStore()
const panel = usePanelState()

const {
   onReferClick,
   onDragerMousemove,
   isReferFolded,
   isDragerPanelShowed,
   referHeightStyle
} = usePanelHeight()

function onOpenClick() {
   openProjectFromBrowser(undefined)
}

function onNewClick() {
   panel.addPanel(new PanelParam({
      label: '新建项目',
      type: PanelType.NewProject,
      init: 'NewProject'
   }))
}
</script>

<template>
   <LeftTabLayout>
      <template #header>
         <div :class="$style.header">
            <span>实体类管理</span>
         </div>
      </template>
      <template #panel>
         <div :class="$style.panel" v-if="store.loaded">
            <ul>
               <!-- 上半 -->
               <p class="scroll">
                  <Search placeholder="搜索对象"></Search>
                  <PkgView :pkg="store.main" :isMain="true"></PkgView>
               </p>
               <!-- 拖动框 -->
               <legend>
                  <b @mousedown="isDragerPanelShowed = true" :class="$theme['projres-drager']"
                     :dragging="isDragerPanelShowed"></b>
               </legend>
               <!-- 下半 -->
               <p :style="referHeightStyle">
               <h2 @click="onReferClick" :class="$theme['projres-referbar']">
                  <em><span class="folder" :folded="isReferFolded">&gt;</span><span>引用</span></em>
               </h2>
               <section class="scroll">
                  <PkgView v-for="pkg in store.referPackages" :pkg="pkg"></PkgView>
                  <h3 v-if="isEmptyObject(store.referPackages)"><span>暂无引用</span></h3>
               </section>
               </p>
            </ul>
            <i @mouseup="isDragerPanelShowed = false" @mouseout="isDragerPanelShowed = false"
               v-show="isDragerPanelShowed" @mousemove="onDragerMousemove"></i>
         </div>
         <div v-else :class="$style.open">
            <lazy-button @click="onOpenClick" class="vertical-center">
               <s v-svgicon="dirSvg" class="normal-button" padding="15%"></s>
               <h2>打开项目</h2>
            </lazy-button>
            <lazy-button @click="onNewClick" class="vertical-center">
               <s v-svgicon="newSvg" class="normal-button" padding="15%"></s>
               <h2>新建项目</h2>
            </lazy-button>
         </div>
      </template>
   </LeftTabLayout>
</template>

<style scoped module="$theme" src="@css/lefttab.scss"></style>
<style scoped lang='scss' module>
.header {
   text-overflow: ellipsis;
   white-space: nowrap;
}

.panel {
   height: 100%;
   position: relative;

   ul {
      display: flex;
      flex-direction: column;
      height: 100%;
   }

   h3 {
      padding-left: align-size(normal);
   }

   p {
      position: relative;
      z-index: 0;
   }

   p:nth-child(1) {
      flex: 1;
   }

   p:nth-child(3) {
      flex: 0;
      flex-basis: 200px;
      overflow: hidden;
      min-height: 1lh;

      h2 {
         display: flex;
         align-items: center;
         z-index: 5;
         height: 1lh;
      }

      section {
         height: calc(100% - 1lh);
      }
   }

   // 拖动框
   legend {
      width: 100%;
      height: 0;
      overflow: visible;
      position: relative;

      b {
         display: block;
         position: absolute;
         z-index: 9;
         top: -3px;
         left: 0;
         width: 100%;
         height: 8px;
         cursor: ns-resize;
      }
   }

   i {
      position: absolute;
      z-index: 10;
      display: block;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      cursor: ns-resize;
   }
}

.open {
   @include font-size(big);
   padding: align-size(normal);

   lazy-button {
      display: block;
      height: 1.5lh;
      white-space: nowrap;
   }

   h2 {
      display: inline-block;
      height: 1lh;
      margin-left: 1ch;
   }

   s {
      display: inline-block;
      height: 1lh;
      aspect-ratio: 1;
   }
}
</style>
