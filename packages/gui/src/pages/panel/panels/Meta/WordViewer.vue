<script lang='ts' setup>
import { ref } from 'vue';

import editSvg from '@/asset/icons/edit.svg?raw';
import saveSvg from '@/asset/icons/save.svg?raw';
import ListBox from '@/components/ListBox.vue';
import Markdown from '@/components/Markdown.vue';
import TextBox from '@/components/TextBox.vue';
import { ask, DialogType } from '@/states/dialog';
import { PanelParam } from '@/states/panelList';
import { useMarkdown } from '@/stores/markdownStore';
import { saveWord } from '@/stores/projectStore';
import { HOOK_FILE_TEMPLATE, parseValueTypeExp, WordRo } from '@ra2inier/core';
import { LazyButton } from '@ra2inier/wc';

defineOptions({ name: 'WordViewer' })

const props = defineProps<{ param: PanelParam }>()
const word: WordRo = props.param.data!

const isNoMarkdown = ref(!word.markdown)
if (isNoMarkdown.value) {
   useMarkdown(word.detail).then(res => {
      word.markdown = res
      isNoMarkdown.value = false
   })
}

const disabled = ref(true)

function onSaveClick() {
   // word.valueParam = parseValueTypeExps(word.values)
   word.valueParam = parseValueTypeExp(word.values)
   saveWord(word)
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
   <div class="local-word-editor">
      <!-- 头部标题 -->
      <h1 class="ol-n panel-header">
         <h2><span>{{ word.name }}</span></h2>
         <lazy-button>
            <div v-svgicon="saveSvg" @click="onSaveClick" v-if="!disabled"></div>
            <div v-svgicon="editSvg" @click="onEditClick" v-else></div>
         </lazy-button>
      </h1>

      <!-- 中部info内容 -->
      <main class="scroll">
         <ul>
            <li>
               <span class="required">词条</span><em>::</em>
               <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.name"></flex-input>
            </li>
            <li title="词条的用途简明说明，请控制在20字以内">
               <span>概要</span><em>::</em>
               <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.brief"></flex-input>
            </li>
            <li title="这个词条可能的类型值，字数限制100字">
               <span class="required">取值</span><em>::</em>
               <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.values"></flex-input>
            </li>
            <li title="若该值不填，在游戏中的默认值为多少">
               <span>默认值</span><em>::</em>
               <flex-input class="c-bg-l rd" :disabled="disabled" v-model="word.default"></flex-input>
            </li>
            <p title="作用于什么类型的对象之上，必须是项目中声明的对象类型">
               <li><span class="required">作用对象</span><em>::</em></li>
               <ListBox :list="word.scopes" :disabled="disabled" />
            </p>
            <p title="能出现在什么类型的文件中，必须是项目中声明的文件类型">
               <li><span>作用文件</span><em>::</em></li>
               <ListBox :list="word.files" :disabled="disabled" />
            </p>
         </ul>
         <!-- 脚部 -->
         <div>
            <div><span class="required">hook函数</span>
               <em>::</em>
               <span class="simple-button" @click="onTemplateClick" v-show="!disabled">生成样板代码</span>
            </div>
            <TextBox v-model:text="word.hookScript" :disabled="disabled" />
         </div>
         <!-- 底部详情区域 -->
         <div><span>详细介绍</span><em>::</em></div>
         <div v-if="(!isNoMarkdown) && word.markdown!.key">
            <Markdown :data="word.markdown!" :disabled="disabled"></Markdown>
         </div>
         <footer></footer>
      </main>
   </div>
</template>

<style scoped lang='scss'>
.local-word-editor {
   height: 100%;
   position: relative;
   z-index: auto;
   @import "./meta.scss";
}
</style>
