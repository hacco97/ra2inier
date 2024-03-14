<script lang='ts' setup>
import { shallowReactive, watch } from 'vue';

import addSvg from '@/asset/icons/add.svg?raw';
import { addPanel, PanelParam, PanelType } from '@/states/panelList';
import {
   cloneIniObject, createIniObject, saveObject,
} from '@/stores/projectStore';
import { IniObjectRo, isUniqueObject, PackageRo } from '@ra2inier/core';

import ObjView from './ObjView.vue';

const DEFAULT_GROUP_NAME = '#0'
defineOptions({ name: 'PkgView' })
const props = defineProps<{ pkg: PackageRo, isMain?: boolean }>()

// 初始化分组列表
// 分组逻辑
const view: Record<string, Record<string, IniObjectRo>> = shallowReactive({})

function initView() {
   const objects = props.pkg.objects
   for (const key in view) { delete view[key] }
   for (const key in objects) { addNewObjectToView(objects[key]) }
}

watch(() => props.pkg, initView, { immediate: true })

function addNewObjectToView(object: IniObjectRo) {
   if (!object.group) object.group = DEFAULT_GROUP_NAME
   const g = object.group
   if (!view[g]) (view[g] = shallowReactive({}))
   view[g][object.key] = object
}

function onSave(object: IniObjectRo) {
   const tmp = cloneIniObject(object)
   saveObject(tmp)
   addNewObjectToView(tmp)
}

function openObjectPanel(object: IniObjectRo) {
   const opened = cloneIniObject(object)
   const p: PanelParam = new PanelParam({
      label: opened.name,
      type: props.isMain ? PanelType.ObjectEditor : PanelType.ObjectViewer,
      data: opened,
      readonly: !props.isMain
   })
   if (props.isMain) { p.on('save', onSave) }
   addPanel(p)
}

function onAddClick() {
   openObjectPanel(createIniObject())
}

function onObjectOpen(object: IniObjectRo) {
   if (!isUniqueObject(object)) return
   openObjectPanel(object)
}
</script>


<template>
   <div :class="$style.pkgview">
      <h1>
         <q><span>package</span><em>::</em><span>{{ pkg.name }}</span></q>
         <s v-svgicon="addSvg" class="fore-button" v-if="isMain" @click="onAddClick"></s>
      </h1>
      <ul v-for="(group, gkey) of view" :key="gkey">
         <!-- 组的标题 -->
         <h2 v-show="gkey !== DEFAULT_GROUP_NAME">
            <span>group</span><em>::</em><span>{{ gkey }}</span>
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

.pkgview {
   position: relative;

   h1 {
      position: relative;
      z-index: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: nowrap;
      height: $header-height;
      padding-left: align-size(normal);
   }

   h2 {
      height: $header-height;
   }

   s {
      display: block;
      margin: 2px;
      height: 80%;
      aspect-ratio: 1;
   }
}
</style>
