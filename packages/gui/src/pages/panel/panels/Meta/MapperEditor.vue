<script lang='ts' setup>
import { reactive, ref } from 'vue';

import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/ListBox.vue';
import MapBox from '@/components/MapBox.vue';
import { PanelParam } from '@/states/panelList';
import { MapperRo } from '@ra2inier/core';
import { FlexArea, FlexInput, LazyButton } from '@ra2inier/wc';

import HeaderLayout from '../HeaderLayout.vue';

const props = defineProps<{ param: PanelParam }>()
const mapper: MapperRo = reactive(props.param.data)
const param = props.param
const disabled = ref(true)


function submit() {
   param.data = mapper
}
param.on('before-closed', submit)

function onSaveClick() {
   disabled.value = true
   param.emit('save', mapper)
}

function onEditClick() {
   disabled.value = false
}

function onNameChange() {
   param.label = mapper.name
}

</script>


<template>
   <HeaderLayout>
      <template #header>
         <h2 :class="[$theme.header, $style.header]">
            <span>{{ mapper.name }}</span>
            <lazy-button class="fore-button" v-if="!param.readonly">
               <div v-svgicon="saveSvg" @click="onSaveClick" v-if="!disabled"></div>
               <div v-svgicon="editSvg" @click="onEditClick" v-else></div>
            </lazy-button>
         </h2>
      </template>
      <template #default>
         <!-- 中部info内容 -->
         <ul :class="[$style.main, $theme.main]">
            <h2>
               <span class="required">输出器名称</span><em>：</em>
               <flex-input :disabled="disabled" v-model.lazy="mapper.name" @change="onNameChange"></flex-input>
            </h2>
            <h2>
               <span title="相对路径——相对于输出文件夹的位置" class="required">输出路径</span><em>：</em>
               <flex-input :disabled="disabled" v-model.lazy="mapper.targetPath"></flex-input>
            </h2>
            <h2><span>备注</span><span>：</span></h2>
            <li>
               <flex-area :disabled="disabled" v-model.lazy="mapper.detail"></flex-area>
            </li>
            <h2>
               <span class="required">分发规则</span><span>：</span>
            </h2>
            <li>
               <MapBox :disabled="disabled" :map="mapper.inputList" />
            </li>
            <h2>
               <span class="required">输出顺序</span><span>：</span>
            </h2>
            <li>
               <ListBox :disabled="disabled" :list="mapper.outputList" />
            </li>
            <h2>
               <span class="required">输出器脚本</span><span>：</span>
            </h2>
            <li>
               <flex-area :disabled="disabled" v-model.lazy="mapper.handlerScript"></flex-area>
            </li>

         </ul>
      </template>
   </HeaderLayout>
</template>

<style src="@css/meta-panel.scss" scoped module="$theme" />
<style scoped src="./meta-layout.scss" module></style>
