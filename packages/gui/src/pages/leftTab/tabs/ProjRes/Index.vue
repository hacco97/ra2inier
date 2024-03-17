<script lang='ts' setup>
import { loadingVersion, mainPackage, referPackages } from '@/stores/projectStore';
import LeftTabLayout from '../Layout.vue';
import { usePanelHeight } from './panelHeight';
import PkgView from './PkgView.vue';
import { isEmptyObject } from '@ra2inier/core';

const {
   onReferClick,
   onDragerMousemove,
   isReferFolded,
   isDragerPanelShowed,
   referHeightVBind
} = usePanelHeight()

</script>

<template>
   <LeftTabLayout>
      <template #header>
         <div :class="$style.header">
            <span>实体类管理</span>
         </div>
      </template>
      <template #panel :key="loadingVersion">
         <div :class="$style.panel">

            <ul>
               <p class="scroll">
                  <PkgView :pkg="mainPackage" :isMain="true"></PkgView>
               </p>
               <legend>
                  <b @mousedown="isDragerPanelShowed = true" :class="$theme['projres-drager']"
                     :dragging="isDragerPanelShowed"></b>
               </legend>
               <p>
               <h2 @click="onReferClick" :class="$theme['projres-referbar']">
                  <em><span class="folder" :folded="isReferFolded">&gt;</span><span>引用</span></em>
               </h2>
               <section class="scroll">
                  <PkgView v-for="pkg in referPackages" :pkg="pkg"></PkgView>
                  <h3 v-if="isEmptyObject(referPackages)"><span>暂无引用</span></h3>
               </section>
               </p>
            </ul>
            <i @mouseup="isDragerPanelShowed = false" @mouseout="isDragerPanelShowed = false" v-show="isDragerPanelShowed"
               @mousemove="onDragerMousemove"></i>
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

   ul {
      display: flex;
      flex-direction: column;
      height: 100%;
   }

   p {
      position: relative;
      z-index: 0;
   }

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

   p:nth-child(1) {
      flex: 1;
   }

   p:nth-child(3) {
      flex: 0;
      flex-basis: v-bind(referHeightVBind);
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

   h3 {
      padding-left: align-size(normal);
   }
}
</style>
