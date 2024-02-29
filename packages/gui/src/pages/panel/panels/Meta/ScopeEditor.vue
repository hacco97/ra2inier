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
import { FlexArea, FlexInput, LazyButton } from '@ra2inier/wc';

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
         <main :class="[$style.scope, $theme.main]">
            <!-- 中部info内容 -->
            <ul>
               <h2>
                  <span class="required">类型名称*</span><span>：</span>
                  <flex-input v-model="scope.name" :disabled="disabled" @change="onNameChange" />
               </h2>
               <h2>
                  <span>类型概要</span><span>：</span>
                  <flex-input v-model="scope.brief" :disabled="disabled" />
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
<style scoped lang='scss' module>
$height: line-height(small);
$align: align-size(normal);

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
      margin: 0 $align
   }
}

main.scope {

   li,
   h2 {
      display: flex;
      flex-wrap: nowrap;
      padding: 0 $align;
      min-height: $height;
      line-height: $height;
      overflow: hidden;
      white-space: nowrap;
   }

   h2 {
      margin-top: $align;
   }

   flex-area {
      width: 100%;
      padding: 0 $align;

      &[disabled=true] {
         padding: 0;
      }
   }

   flex-input {
      padding: 0 $align;

      &[disabled=true] {
         padding: 0;
      }
   }

}
</style>
