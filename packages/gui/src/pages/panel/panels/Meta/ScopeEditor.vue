<script lang='ts' setup>
import { provide, ref } from 'vue';

import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/ListBox.vue';
import MapBox from '@/components/MapBox.vue';
import TextBox from '@/components/TextBox.vue';
import { PanelParam } from '@/states/panelList';
import { saveScope } from '@/stores/projectStore/metaStore';
import { ScopeRo } from '@ra2inier/core';
import { FlexInput, LazyButton } from '@ra2inier/wc';

import HeaderLayout from '../HeaderLayout.vue';

defineOptions({ name: 'ScopeEditor' })
const props = defineProps<{ param: PanelParam }>()


const scope: ScopeRo = props.param.data!
const panelParam = props.param
const disabled = ref(true)

function onNameChange() {
   panelParam.label = scope.name
}

function onSaveClick() {
   disabled.value = true
   setTimeout(() => saveScope(scope), 50)
}

function onEditClick() {
   disabled.value = false
}

provide('toSave', disabled)

</script>


<template>
   <HeaderLayout>
      <template #header>
         <h2 :class="[$theme.header, $style.scope]" class="panel-header">
            <span>{{ scope.name }}</span>
            <lazy-button class="fore-button">
               <div v-svgicon="saveSvg" @click="onSaveClick" v-if="!disabled"></div>
               <div v-svgicon="editSvg" @click="onEditClick" v-else></div>
            </lazy-button>
         </h2>
      </template>
      <template #default>
         <!-- 中部info内容 -->
         <ul :class="$style.scope">
            <li>
               <span class="required">类型名称</span><span>::</span>
               <flex-input v-model="scope.name" :disabled="disabled" @change="onNameChange" />
            </li>
            <li>
               <span>类型概要</span><span>::</span>
               <flex-input v-model="scope.brief" :disabled="disabled" />
            </li>
            <div>
               <span class="required">输出文件</span><span>::</span>
               <span>
                  <ListBox :list="scope.files" :disabled="disabled" />
               </span>
            </div>
            <div>
               <span>适用环境</span><span>::</span><span>
                  <MapBox :map="scope.env" :disabled="disabled" />
               </span>
            </div>
         </ul>
         <!-- 底部详细内容 -->
         <div>
            <span>详细介绍</span><span>::</span>
            <span>
               <TextBox v-model:text="scope.detail" :disabled="disabled" />
            </span>
         </div>
      </template>
   </HeaderLayout>
</template>

<style src="./meta.scss" scoped />
<style src="@css/meta-panel.scss" scoped module="$theme" />
<style scoped lang='scss' module>
h2.scope {
   display: flex;
   height: 100%;
   width: 100%;
   align-items: center;

   lazy-button {
      height: 100%;
      aspect-ratio: 1;
   }

   >* {
      margin: 0 1ch
   }
}

.scope {}
</style>
