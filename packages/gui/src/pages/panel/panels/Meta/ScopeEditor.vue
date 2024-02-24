<script lang='ts' setup>
import { provide, ref, shallowReactive } from 'vue';

import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/ListBox.vue';
import MapBox from '@/components/MapBox.vue';
import TextBox from '@/components/TextBox.vue';
import { PanelParam } from '@/states/panelList';
import { saveScope } from '@/stores/projectStore/metaStore';
import { ScopeRo } from '@ra2inier/core';
import { LazyButton } from '@ra2inier/wc';

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
   <div class="scope-editor scroll">
      <!-- 头部标题 -->
      <h1 class="ol-n">
         <h2><span>{{ scope.name }}</span></h2>
         <lazy-button>
            <div v-svgicon="saveSvg" @click="onSaveClick" v-if="!disabled"></div>
            <div v-svgicon="editSvg" @click="onEditClick" v-else></div>
         </lazy-button>
      </h1>

      <main>
         <!-- 中部info内容 -->
         <ul>
            <li>
               <span class="required">类型名称</span><span>::</span>
               <flex-input class="rd c-bg-l" v-model="scope.name" :disabled="disabled" @change="onNameChange"></flex-input>
            </li>
            <li>
               <span>类型概要</span><span>::</span>
               <flex-input class="rd c-bg-l" v-model="scope.brief" :disabled="disabled"></flex-input>
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
         <footer></footer>
      </main>
   </div>
</template>

<style scoped lang='scss'>
.scope-editor {
   height: 100%;
   position: relative;
   z-index: auto;
   @import "./meta.scss";
}
</style>
