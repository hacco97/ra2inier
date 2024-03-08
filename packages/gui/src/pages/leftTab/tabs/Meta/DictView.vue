<script lang='ts' setup>
import { shallowReactive } from 'vue';

import { useCtxMenu } from '@/states/ctxMenu';
import { addPanel, PanelParam, PanelType } from '@/states/panelList';
import { addWord, packageNames, saveWord } from '@/stores/projectStore';
import { cloneTyped, copy, WordRo } from '@ra2inier/core';

import { isReadonly } from './metaState';

defineOptions({ name: 'DictView' })

const props = defineProps<{ dictionary: Record<string, WordRo> }>()
const dictView: Record<string, WordRo> = shallowReactive(props.dictionary)

function onSave(word: WordRo) {
   const newOne = cloneTyped(word, WordRo)
   saveWord(newOne)
   dictView[newOne.key] = newOne
}

function openWordPanel(word: WordRo) {
   const newWord = new WordRo
   copy(word, newWord)
   const p = new PanelParam({
      label: word.name,
      type: PanelType.WordEditor,
      data: newWord,
      readonly: isReadonly(word)
   })
   if (!isReadonly(word)) {
      p.on('save', onSave)
      p.on('closed', onSave)
   }
   addPanel(p)
}

function onOpenClick(word: WordRo) {
   openWordPanel(word)
}

const vCtxmenu = useCtxMenu({
   '新建词条'() {
      openWordPanel(addWord())
   },
})
</script>


<template>
   <div :class="$style.dict" v-ctxmenu>
      <h2>Word::词条类型</h2>
      <ul>
         <li v-for="(word, key) in dictView" :key="key" @dblclick="onOpenClick(word)" class="list-item">
            <span>{{ packageNames[word.package] }}</span><span>/</span>
            <span>{{ word.dictionary }}</span><span>/</span>
            <span>{{ word.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
.dict {
   @import './meta.scss';
}
</style>
