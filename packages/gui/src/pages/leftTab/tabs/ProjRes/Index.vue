<script lang='ts' setup>
import { computed } from 'vue';
import LeftTabLayout from '../Layout.vue'
import PkgView from './PkgView.vue'
import { loadingVersion, mainPackage, useProject } from '@/stores/projectStore'
import { usePanelHeight } from './panelHeight'
defineOptions({ name: 'ProjRes' })

const project = useProject()
const packages = computed(() => {
   const list = [], mainKey = mainPackage.value.key
   const packages = project.value.packages
   for (const pkgKey in packages) {
      if (pkgKey === mainKey) continue
      list.push(packages[pkgKey])
   }
   return list
})

const {
   onReferClick,
   onDragerMousemove,
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
               <p>
               <h2 @click="onReferClick">
                  <b @mousedown="isDragerPanelShowed = true"></b>
                  <em><span>&gt;</span><span>引用</span></em>
               </h2>
               <section class="scroll">
                  <PkgView v-for="pkg in packages" :pkg="pkg"></PkgView>
               </section>
               </p>
            </ul>
            <i @mouseup="isDragerPanelShowed = false" @mouseout="isDragerPanelShowed = false" v-show="isDragerPanelShowed"
               @mousemove="onDragerMousemove"></i>
         </div>
      </template>
   </LeftTabLayout>
</template>

<style scoped lang='scss' module>
$height: line-height(small);

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

   p:nth-child(1) {
      flex: 1;
   }

   p:nth-child(2) {
      flex: 0;
      flex-basis: v-bind(referHeightVBind);
      overflow: hidden;
      min-height: $height;

      h2 {
         position: relative;
         z-index: 5;
         height: $height;
         line-height: $height;
         outline-width: 1px;
      }

      b {
         display: block;
         position: absolute;
         z-index: 9;
         top: -5px;
         left: 0;
         width: 100%;
         height: 10px;
         cursor: ns-resize;
      }

      section {
         height: calc(100% - $height);
      }
   }
}
</style>
