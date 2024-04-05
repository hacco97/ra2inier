<script lang='ts' setup>
import dictSvg from '@/asset/icons/dict.svg?raw'
import { useCtxMenuState } from '@/states/ctxMenu';
import { PanelParam, PanelType, usePanelState } from '@/states/panelList';
import { cloneTyped, WordRo } from '@ra2inier/core';
import { isReadonly, getPackageName } from './metaState';
import { reactiveComputed } from '@vueuse/core';
import { useProjectStore } from '@/stores/projectStore';

const props = defineProps<{ dictionary: Record<string, WordRo> }>()
const dictView: Record<string, WordRo> = reactiveComputed(() => props.dictionary)

const store = useProjectStore()
const panel = usePanelState()
const ctxmenu = useCtxMenuState()

function onSave(word: WordRo) {
   const newOne = cloneTyped(word, WordRo)
   store.saveWord(newOne)
   dictView[newOne.key] = newOne
}

function openWordPanel(word: WordRo) {
   const newWord = cloneTyped(word, WordRo)
   const p = new PanelParam({
      label: word.name,
      type: PanelType.WordEditor,
      init: newWord,
      readonly: isReadonly(word)
   })
   if (!isReadonly(word)) p.on('saved', onSave)
   panel.addPanel(p)
}

function onOpenClick(word: WordRo) {
   openWordPanel(word)
}

const vCtxmenu = ctxmenu.useCtxMenu({
   '新建词条'() {
      openWordPanel(store.addWord())
   },
})
</script>


<template>
   <div :class="$style.dict" v-ctxmenu>
      <h2 class="list-item">
         <p v-svgicon="dictSvg" padding="0"></p>
         <span>字典</span>
      </h2>
      <ul>
         <li v-for="(word, key) in dictView" :key="key" @dblclick="onOpenClick(word)" class="list-item">
            <span>{{ getPackageName(word) }}</span><span>/</span>
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
