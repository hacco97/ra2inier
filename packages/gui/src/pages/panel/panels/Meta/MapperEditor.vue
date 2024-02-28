<script lang='ts' setup>
import { ref, shallowReactive } from 'vue';

import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/ListBox.vue';
import MapBox from '@/components/MapBox.vue';
import TextBox from '@/components/TextBox.vue';
import { PanelParam } from '@/states/panelList';
import { saveMapper } from '@/stores/projectStore/metaStore';
import { MapperRo } from '@ra2inier/core';
import { LazyButton } from '@ra2inier/wc';

defineOptions({ name: 'MapperEditor' })
const props = defineProps<{ param: PanelParam }>()

const mapper: MapperRo = props.param.data!

const disabled = ref(true)

function onSaveClick() {
   disabled.value = true
   saveMapper(mapper)
}

function onEditClick() {
   disabled.value = false
}

function onNameChange() { }

</script>


<template>
   <div class="mapper-editor scroll">
      <!-- 头部标题 -->
      <h1>
         <h2><span>{{ mapper.name }}</span></h2>
         <lazy-button>
            <div v-svgicon="saveSvg" @click="onSaveClick" v-if="!disabled"></div>
            <div v-svgicon="editSvg" @click="onEditClick" v-else></div>
         </lazy-button>
      </h1>
      <main>
         <!-- 中部info内容 -->
         <ul>
            <li>
               <span class="required">名称</span><em>::</em>
               <flex-input :disabled="disabled" v-model="mapper.name"></flex-input>
            </li>
            <li>
               <span title="相对路径——相对于输出文件夹的位置" class="required">输出路径</span><em>::</em>
               <flex-input :disabled="disabled" v-model="mapper.targetPath"></flex-input>
            </li>
            <div>
               <span>详情</span><span>::</span>
               <span>
                  <TextBox :disabled="disabled" v-model:text="mapper.detail" />
               </span>
            </div>
            <div>
               <span class="required">handlerScript</span><span>::</span>
               <span>
                  <TextBox :disabled="disabled" v-model:text="mapper.handlerScript" />
               </span>
            </div>
            <div>
               <span class="required">输入handler函数</span><span>::</span>
               <span>
                  <MapBox :disabled="disabled" :map="mapper.inputList" />
               </span>
            </div>
            <div>
               <span class="required">输出handler函数</span><span>::</span>
               <span>
                  <ListBox :disabled="disabled" :list="mapper.outputList" />
               </span>
            </div>
         </ul>
      </main>
      <footer></footer>
   </div>
</template>

<style scoped lang='scss'>
.mapper-editor {
   height: 100%;
   position: relative;
   z-index: auto;
   @import "./meta.scss";
}
</style>
