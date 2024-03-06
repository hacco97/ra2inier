<script lang='ts' setup>
import { ref } from 'vue';

import columnSvg from '@/asset/icons/column.svg?raw';
import { PanelParam } from '@/states/panelList';
import { projectName } from '@/stores/projectStore';
import { IniObjectRo } from '@ra2inier/core';

import HeaderLayout from '../HeaderLayout.vue';

interface Prop {
   param: PanelParam
}
const props = defineProps<Prop>()
const object: IniObjectRo = props.param.data
const pName = projectName
const currentChild = ref('')
const columnCount = ref(0)


function onColumnClick() {

}
</script>


<template>
   <HeaderLayout>
      <template #header>
         <div :class="$style.editor" tabindex="-1">
            <!-- 头部 -->
            <h1 class="scrollx" v-scrollx>
               <ul>
                  <h2>
                     <em>./</em><span>{{ pName }}</span><em>/</em>
                     <i></i><q>{{ pName }}</q>
                     <em>.</em>
                     <em>{{ object.scope }}</em><i></i>
                     <em>/</em><i></i>
                     <em>{{ currentChild }}</em>
                  </h2>
                  <label></label>
                  <label></label>
                  <aside :class="$style.buttons">
                     <s title="分栏" padding="15%" v-svgicon="columnSvg" class="fore-button" :column="columnCount"
                        :class="$style.column" @click="onColumnClick"></s>
                  </aside>
               </ul>
            </h1>
         </div>
      </template>

      <template #default>
         <!-- 编辑视图 -->
         <ul :class="$layout.list" id="object-editor">
            <li v-for="entry in object.entry">
               <span>{{ entry.key }}</span>
               <em>=</em>
               <i>{{ entry.values.join(',') }}</i>
               <p>{{ entry.comment }}</p>
            </li>
         </ul>
      </template>
   </HeaderLayout>
</template>

<style scoped src="./editor.scss" module></style>

<style lang="scss" module="$layout" scoped>
.list {
   li {
      padding: 0 align-size(normal);
      line-height: line-height(normal);

      &:nth-child(even) {
         background-color: var(--color-bg-1);
      }

      &:nth-child(odd) {
         background-color: var(--color-bg-2);
      }
   }

   span {
      background-color: var(--color-bg-3);
   }

   i {
      background-color: var(--color-bg-4);
   }
}
</style>
