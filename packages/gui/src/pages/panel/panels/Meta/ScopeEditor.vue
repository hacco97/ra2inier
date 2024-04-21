<script lang='ts' setup>
import { shallowReactive } from 'vue';
import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/dirty/ListBox.vue';
import MapBox from '@/components/dirty/MapBox.vue';
import { PanelParam } from '@/states/panelList';
import { ScopeRo } from '@ra2inier/core';
import { FlexArea, FlexInput, LazyButton } from '@ra2inier/wc';
import HeaderLayout from '../HeaderLayout.vue';
import { useFlip } from './flip';

defineOptions({ name: 'ScopeEditor' })
const props = defineProps<{ param: PanelParam }>()
const scope: ScopeRo = shallowReactive(props.param.init!)
const param = props.param
const { onChanged, disabled, vFlip } = useFlip(props, scope)



function onNameChange() {
   param.label = scope.name
}


</script>


<template>
   <HeaderLayout>
      <template #header>
         <h2 :class="[$theme.header, $style.header]">
            <span>{{ scope.name }}</span>
            <lazy-button class="fore-button" v-flip v-if="!param.readonly">
               <div v-svgicon="saveSvg" v-if="!disabled"></div>
               <div v-svgicon="editSvg" v-else></div>
            </lazy-button>
         </h2>
      </template>
      <template #default>
         <main :class="[$style.main, $theme.main]" @keydown="onChanged">
            <!-- 中部info内容 -->
            <ul class="list-view">
               <h2>
                  <span class="required">类型名称*</span><span>：</span>
                  <flex-input v-model.lazy="scope.name" :disabled="disabled" @change="onNameChange" />
               </h2>
               <h2>
                  <span>类型概要</span><span>：</span>
                  <flex-input v-model.lazy="scope.brief" :disabled="disabled" />
               </h2>
               <h2><span class="required">输出文件*</span><span>：</span></h2>
               <li>
                  <ListBox :list="scope.files" :disabled="disabled" />
               </li>
               <h2><span>适用环境</span><span>：</span><span></span></h2>
               <li>
                  <MapBox :map="scope.env" :disabled="disabled" />
               </li>
            </ul>
            <!-- 底部详细内容 -->
            <h2><span>详细介绍</span><span>：</span></h2>
            <li>
               <flex-area v-model.lazy="scope.detail" :disabled="disabled"></flex-area>
            </li>
         </main>
      </template>
   </HeaderLayout>
</template>

<style src="@css/meta-panel.scss" scoped module="$theme" />
<style src="./meta-layout.scss" scoped module></style>
