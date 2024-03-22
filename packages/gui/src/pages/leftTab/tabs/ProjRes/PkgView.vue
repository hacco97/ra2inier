<script lang='ts' setup>
import addSvg from '@/asset/icons/add.svg?raw';
import ObjView from './ObjView.vue';
import { PkgViewProp, createPkgViewState, useVFlod } from './pkgViewState';
import { useGroupCtxmenu, usePkgviewCtxmenu } from './pkgViewState'
import { FlexInput } from '@ra2inier/wc';

const props = defineProps<PkgViewProp>()
const pkgViewState = createPkgViewState(props)
const { view, viewInfo, onAddClick, onObjectOpen, renameGroup } = pkgViewState
const { getFolderStyle, getFoldedStyle, flip, isGroupFoldedMap } = useVFlod(pkgViewState)
const { vGroupMenu, } = useGroupCtxmenu(pkgViewState)
const vPkgviewMenu = usePkgviewCtxmenu(pkgViewState)

function onGroupNameChange(input: FlexInput, gkey: string) {
   renameGroup(gkey, input.value)
   getSelection()?.removeAllRanges()
}

function onGroupNameBlur(input: FlexInput) {
   input.setAttribute('disabled', 'true')
   getSelection()?.removeAllRanges()
}
</script>


<template>
   <div :class="$style.pkgview">
      <h1 class="list-item normal-panel" v-pkgview-menu>
         <q><span>{{ pkg.name }}</span><em>&nbsp;/&nbsp;</em></q>
         <s v-svgicon="addSvg" class="fore-button" v-if="isMain" @click="onAddClick()"></s>
      </h1>
      <ul v-for="(group, gkey) of view" :key="gkey" :style="getFoldedStyle(gkey)" v-group-menu="gkey">
         <!-- 组的标题 -->
         <h2 class="list-item" @click="flip(gkey)">
            <b class="folder" :style="getFolderStyle(gkey)" :folded="isGroupFoldedMap[gkey]">&gt;</b>
            <flex-input class="group-name" :value="gkey" @change="onGroupNameChange($event.target, gkey)" disabled="true"
               :placeholder="gkey" @blur="onGroupNameBlur($event.target)"></flex-input>
         </h2>
         <ol v-for="(object, key) of group" :key="key">
            <!-- 对象 -->
            <div v-if="!object.parent">
               <ObjView :object="object" :key="key" @open="onObjectOpen"></ObjView>
            </div>
         </ol>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
$header-height: line-height(small);
$line-height: line-height(tiny);
$padding: align-size(normal);

.pkgview {
   display: flex;
   flex-direction: column;
   position: relative;

   h1 {
      position: relative;
      z-index: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      height: $header-height;
      padding-left: $padding;
      order: 0;

      @include font-size(normal)
   }

   flex-input {
      font-size: inherit;
      pointer-events: none;

      &[disabled=false] {
         text-decoration: underline;
         pointer-events: unset;
         cursor: text;
      }
   }

   h2 {
      display: flex;
      height: $header-height;
      padding-left: $padding ;
   }

   s {
      display: block;
      height: 0.8lh;
      aspect-ratio: 1;
   }

   ul {
      overflow: hidden;
   }
}
</style>
