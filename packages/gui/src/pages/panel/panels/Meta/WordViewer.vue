<script lang='ts' setup>
import { ref, Ref, shallowReactive } from 'vue';

import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/ListBox.vue';
import Markdown from '@/components/Markdown.vue';
import { ask, DialogType } from '@/states/dialog';
import { PanelParam } from '@/states/panelList';
import { useMarkdown } from '@/stores/markdownStore';
import { saveWord } from '@/stores/projectStore';
import {
  copy, HOOK_FILE_TEMPLATE, MarkdownRo, parseValueTypeExp, WordRo,
} from '@ra2inier/core';
import { FlexArea, FlexInput, LazyButton } from '@ra2inier/wc';

import HeaderLayout from '../HeaderLayout.vue';

const props = defineProps<{ param: PanelParam }>()
const param = props.param
const word: WordRo = shallowReactive(props.param.data)

const isNoMarkdown = ref(!word.markdown)
if (isNoMarkdown.value) {
   useMarkdown(word.detail).then(res => {
      word.markdown = res
      isNoMarkdown.value = false
   })
}

function submit() {
   word.markdown || (word.markdown = new MarkdownRo)
   copy(md.value!.value(), word.markdown)
   word.valueParam = parseValueTypeExp(word.values)
   param.data = word
}
param.on('before-closed', submit)

const disabled = ref(true)

const md = ref<InstanceType<typeof Markdown>>()
function onSaveClick() {
   submit()
   param.emit('save', word)
   disabled.value = true
}

function onEditClick() {
   disabled.value = false
}

let asking = false

async function onTemplateClick() {
   if (!word.hookScript.trim()) {
      word.hookScript = HOOK_FILE_TEMPLATE
   } else {
      if (asking) return
      asking = true
      const res: boolean = await ask('是否覆盖现有的文本', DialogType.askIf, true)
      asking = false
      if (res) word.hookScript = HOOK_FILE_TEMPLATE
   }
}
</script>


<template>
   <HeaderLayout>
      <template #header>
         <h2 :class="[$theme.header, $style.header]">
            <span>{{ word.name }}</span>
            <lazy-button class="fore-button" v-if="!param.readonly">
               <div v-svgicon="saveSvg" @click="onSaveClick" v-if="!disabled"></div>
               <div v-svgicon="editSvg" @click="onEditClick" v-else></div>
            </lazy-button>
         </h2>
      </template>
      <template #default>
         <!-- 中部info内容 -->
         <main :class="[$style.main, $theme.main]">
            <ul>
               <h2>
                  <span class="required">词条</span><em>：</em>
                  <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.name"></flex-input>
               </h2>
               <h2 title="词条的用途简明说明，请控制在20字以内">
                  <span>概要</span><em>：</em>
                  <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.brief"></flex-input>
               </h2>
               <h2 title="这个词条可能的类型值，字数限制100字">
                  <span class="required">取值</span><em>：</em>
                  <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.values"></flex-input>
               </h2>
               <h2 title="若该值不填，在游戏中的默认值为多少">
                  <span>默认值</span><em>：</em>
                  <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.default"></flex-input>
               </h2>
               <h2 title="作用于什么类型的对象之上，必须是项目中声明的对象类型"><span class="required">作用对象</span><em>：</em></h2>
               <li>
                  <ListBox :list="word.scopes" :disabled="disabled" />
               </li>
               <h2 title="能出现在什么类型的文件中，必须是项目中声明的文件类型"><span>作用文件</span><em>：</em></h2>
               <li>
                  <ListBox :list="word.files" :disabled="disabled" />
               </li>
            </ul>
            <!-- 脚部 -->
            <h2><span class="required">hook函数</span><em>：</em>
               <span class="simple-button" @click="onTemplateClick" v-show="!disabled">生成样板代码</span>
            </h2>
            <li><flex-area v-model.lazy="word.hookScript" :disabled="disabled"></flex-area></li>
            <!-- 底部详情区域 -->
            <h2><span>详细介绍</span><em>：</em></h2>
            <li v-if="(!isNoMarkdown) && word.markdown!.key">
               <Markdown ref="md" :markdown="word.markdown!" :disabled="disabled"></Markdown>
            </li>
         </main>
      </template>
   </HeaderLayout>
</template>

<style src="@css/meta-panel.scss" scoped module="$theme" />
<style src="./meta-layout.scss" scoped module></style>
