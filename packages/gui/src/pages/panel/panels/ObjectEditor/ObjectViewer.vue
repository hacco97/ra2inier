<script lang='ts' setup>
import { ref } from 'vue';
import HeaderLayout from '../HeaderLayout.vue';
import columnSvg from '@/asset/icons/column.svg?raw';
import { PanelParam } from '@/states/panelList';
import { IniObjectRo } from '@ra2inier/core';
import { useProjectStore } from '@/stores/projectStore';

const store = useProjectStore()


interface Prop {
   param: PanelParam
}
const props = defineProps<Prop>()
const object: IniObjectRo = props.param.init
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
                     <em>./</em><span>{{ store.projectName }}</span><em>/</em>
                     <i></i><q>{{ store.projectName }}</q>
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
               <span>{{ entry.wordName }}</span>
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
