<script setup lang="ts">
import { computed, ref, shallowReactive } from 'vue';

import ListBox from '@/components/ListBox.vue';
import MapBox from '@/components/MapBox.vue';
import { useFocus } from '@/hooks/focus';
import { FlexArea, FlexInput } from '@ra2inier/wc';

import { useEditorKeymap } from './editorKeymap';
import {
  EditorState, EntryRo, useCursorCoord, usePromptCoord,
} from './eidtorState';
import Prompt from './Prompt.vue';
import { PromptState } from './promptState';

// 初始化数据
const props = defineProps<{ state: EditorState }>()
const state = props.state
const { entrys, data: object } = state
const promptState = shallowReactive(new PromptState)


// 焦点逻辑
const focus = useFocus()
const vFocus = focus.directive
const vAutoFocus = { mounted(el: HTMLElement) { el.focus() } }

// 提示框定位逻辑
const { onColFocus, onRowFocus, translate: promptPosition } = usePromptCoord()
function onInputFocused(e: Event, order: number, vid: number, entry: EntryRo) {
   // 切换焦点
   focus.setCurrent(order + vid)
   // 切换被选择的词条
   entry.vid = vid
   promptState.setEntry(entry)
   // 隐藏提示框防止闪烁，重定位提示框位置
   promptState.hide()
   onColFocus(e)
   e.currentTarget!.dispatchEvent(new CustomEvent('flex-focus', { bubbles: true }))
}
function onNewInputFocused(e: KeyboardEvent) {
   const order = state.length
   focus.setCurrent(order)
   promptState.hide()
   onColFocus(e)
   e.currentTarget!.dispatchEvent(new CustomEvent('flex-focus', { bubbles: true }))

}

// 提示框交互逻辑
function onPromptSubmit(value: string) {
   promptState.hide()
   focus.focusCurrent()
}
function onInputCtxMenu(e: Event) {
   promptState.active()
   e.preventDefault()
   e.stopPropagation()
}

// 键盘监听逻辑
const {
   inputKeymap: vKeymap,
   theNewKeymap: vNkeymap
} = useEditorKeymap({ state, focus, promptState })
function onInputKeydown(e: KeyboardEvent) {
   if (promptState.isShowed) return
   if (e.key.length !== 1) return
   if (e.ctrlKey || e.shiftKey || e.altKey) return
   (<FlexInput>e.target).change()
   promptState.show()
}
function onInputBlur(e: KeyboardEvent) {
   setTimeout(() => {
      if (!promptState.isFocus) {
         promptState.hide()
      }
   }, 10)
}
function onInputChange(e: CustomEvent, eid: number, vid: number) {
   state.setValueById(eid, e.detail, vid)
}

// 游标逻辑
const { onRowClick, current } = useCursorCoord()
function onLabelClick(e: MouseEvent, item: EntryRo) {
   if (e.shiftKey) {
      const a = item.order, b = state.entrys[current.value].order
      const max = Math.max(a, b), min = Math.min(a, b)
      for (const entry of entrys) {
         if (entry.order >= min && entry.order <= max)
            entry.selected = true
      }
   } else {
      item.selected = !item.selected
   }
   current.value = item.id
}
function onLabelAuxClick() {
   for (const entry of entrys) {
      entry.selected = false
   }
}


// 注释逻辑
const THE_NEW_COMMENT_ID = 99999
const isDetailFolded = ref(false)
state.on('comment-insert-require', () => {
   state.commentById(current.value, '')
   const e = state.get(current.value)
   e && (e.isSubFolded = false)
   if (current.value === THE_NEW_COMMENT_ID) {
      isDetailFolded.value = false
   }
})

// 子面板逻辑
const isFolded = (folded: boolean) => `transform: rotate(${folded ? 0 : 90}deg);`
function onSubFoldClick(entry: EntryRo) {
   // console.log(entry.isSubFolded)
   entry.isSubFolded = !entry.isSubFolded
}


//
const columCount = computed(() => ({ columns: state.columnCount }))
</script>

<template>
   <!-- 中部内容 -->
   <main :class="$style.main" id="object-editor">
      <section tabindex="-1">
         <ol>
            <!-- 提示框 -->
            <nav v-show="promptState.isShowed">
               <div :style="promptPosition" class="normal-box">
                  <Prompt :disabled="false" :state="promptState" @blur="onInputBlur" @submit="onPromptSubmit"></Prompt>
               </div>
            </nav>

            <!-- 对象info -->
            <h2>
               <p>附属对象</p>
               <ListBox :list="object.inline" :disabled="false"></ListBox>
               <p>局部变量</p>
               <MapBox :map="object.envVariable" :disabled="false"></MapBox>
               <flex-area v-show="!isDetailFolded" class="scroll" v-model.lazy="state.detail"
                  placeholder="对象备注"></flex-area>
            </h2>

            <ul :style="columCount">
               <!-- 词条编辑框 -->
               <li v-for="(entry, eid) in entrys" :key="entry.id" @click="onRowClick(eid)" :style="{ order: entry.order }">
                  <p @flex-focus="onRowFocus">
                     <i @click="onSubFoldClick(entry)" class="folder" :folded="entry.isSubFolded">&gt;</i>
                     <span :selected="entry.selected" @auxclick="onLabelAuxClick" @click="onLabelClick($event, entry)"
                        :cursor="current === eid">
                        {{ entry.key }}
                     </span>
                     <em>=</em>
                     <flex-input v-for="(v, vid) in entry.values" :key="vid" :value="entry.values[vid]"
                        @change="onInputChange($event, eid, vid)" v-focus="vid + entry.order" v-keymap="entry"
                        @blur="onInputBlur" @focus="onInputFocused($event, entry.order, vid, entry)"
                        @keydown="onInputKeydown" @contextmenu="onInputCtxMenu" />
                  </p>
                  <article v-show="entry.validitys.length > 0">
                     <h3 v-for="validity in entry.validitys">{{ validity.msg }}</h3>
                  </article>
                  <flex-area class="scroll" v-show="!entry.isSubFolded" v-model.lazy="entry.comment"
                     placeholder="添加备注"></flex-area>
               </li>

               <!-- 新词条输入框 -->
               <li @flex-focus="onRowFocus" @click="onRowClick(THE_NEW_COMMENT_ID)">
                  <p>
                     <i></i><span>&nbsp;</span><em>&lt;</em>
                     <flex-input :class="$style['the-new']" v-model.lazy="state.theNew" @focus="onNewInputFocused"
                        v-focus="state.length" v-auto-focus v-nkeymap />
                  </p>
               </li>
            </ul>
         </ol>
      </section>
   </main>
</template>

<style scoped lang="scss">
.new-input {
   position: absolute;
   top: 0;
   left: 0;
   background-color: red !important;
}
</style>

<style scoped lang='scss' module>
$height: align-size(larger);

.main {
   position: relative;
   z-index: var(--z-index-main);
   min-height: 0;
   height: 100%;
   color: var(--color-t-1);

   section {
      height: 100%;
   }

   ol {
      // 不可更改，ol是提示框的定位元素，提示框的工作依赖于ol的相对定位属性
      position: relative;
      z-index: auto;
   }

   ul {
      columns: 1;
      column-fill: balance;
   }

   nav {
      width: 0;
      height: 0;
      overflow: visible;


      >div {
         position: relative;
         z-index: var(--z-index-nav);
         width: fit-content;
      }
   }

   h2 {

      p {
         line-height: $height;
         height: $height;
      }
   }

   flex-area {
      width: 100%;
      height: fit-content;
      padding: align-size(normal);
   }

   @import './editor-view.scss';
}

.the-new {
   min-width: 150px;
}
</style>

