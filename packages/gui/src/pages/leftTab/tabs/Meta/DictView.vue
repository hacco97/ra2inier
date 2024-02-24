<script lang='ts' setup>
import { useCtxMenu } from '@/states/ctxMenu';
import { addPanel, PanelType } from '@/states/panelList';
import { addWord } from '@/stores/projectStore';
import { WordRo } from '@ra2inier/core';

defineOptions({ name: 'DictView' })

const props = defineProps<{ dictionary: Record<string, WordRo> }>()

function onOpenClick(word: WordRo) {
   addPanel({
      label: word.name,
      type: PanelType.WordViewer,
      data: word
   })
}

function addNewWord() {
   const word = addWord()
   addPanel({
      label: 'Word',
      type: PanelType.WordViewer,
      data: word
   })
   props.dictionary[word.key] = word
}

const vCtxmenu = useCtxMenu({
   '添加新词条'() {
      console.log('添加新词条')
      addNewWord()
   },

})
</script>


<template>
   <div class="left-dict" v-ctxmenu>
      <h2>Word::词条类型</h2>
      <ul>
         <li v-for="(word, key) in dictionary" :key="key" @dblclick="onOpenClick(word)" class="c-h-n list-item">
            <span>+</span>
            <!-- <span>{{ word.package().name }}</span><span>&gt;</span> -->
            <span>{{ word.dictionary }}</span><span>&gt;</span>
            <span>{{ word.name }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss'>
$padding-left: 1em;
$height: 25px;

.left-dict {
   li {
      padding-left: $padding-left;


   }

   h2 {
      height: $height;
      line-height: $height;
   }
}
</style>
