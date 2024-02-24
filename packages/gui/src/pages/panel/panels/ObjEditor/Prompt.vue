<script lang='ts' setup>
import { computed, reactive, shallowRef, watch } from 'vue';

import ColorPicker from '@/components/ColorPicker.vue';
import { WordRo } from '@ra2inier/core';
import { NumberInput } from '@ra2inier/wc';

import { usePromptKeymap } from './promptKeymap';
import { Option, PromptState, PromptType, useChildFocus } from './promptState';

const props = defineProps({
   disabled: { type: Boolean, default: false },
   state: { type: PromptState, required: true }
})
const emit = defineEmits(['submit', 'blur'])

// 初始化组件参数
const state = props.state
const word = shallowRef(new WordRo)
const author = computed(() => {
   return word.value.author ? '作者：' + word.value.author : ''
})
function init() {
   if (!state.entry) return
   word.value = state.entry.word
}
watch(() => props.state.entry, init, { immediate: true })

// 焦点控制逻辑
function onPromptFocus() {
   state.isFocus = true
}
function onPromptBlur() {
   state.isFocus = false
   emit('blur')
   state.unactive()
}

// 子元素焦点focus逻辑，该逻辑用于通过使用emit触发，使得Prompt内部子元素的主动focus
const { vChildFocus, focusChild } = useChildFocus()
state.on('focus-child', () => { focusChild(state.type) })


// 键盘处理逻辑
const { vKeymap, enters } = usePromptKeymap(state)
function onPromptSubmit(e: KeyboardEvent) {
   console.log('out')
   e.stopPropagation()
   if (e.key === 'Enter')
      submit(state.value)
}
function submit(ret: string | number) {
   console.log('s', state.value)

   state.entry.setValue(ret)
   state.unactive()
   console.log('ret', ret)

   ret !== undefined && emit('submit', ret)
}

// 枚举类型的处理逻辑
function onOptionClick(id: number) {
   state.active()
   state.cursor = id
}
function onOptionDblClick(option: Option) {
   state.active()
   state.cursor = option.id
   submit(state.value)
}

// 整数类型的处理逻辑
function onFloatInputChange(e: Event) {
   const input = <NumberInput>e.target
   state.float = input.value
   state.floatText = input.text
   submit(state.value)
}
function onIntSubmit(e: Event) {
   const input = <NumberInput>e.target
   state.int = input.value
   submit(input.text)
}

// 颜色类型
const color = reactive({
   red: 0, green: 70, blue: 50
})
function onColorSubmit() {
   if (!state.entry) return
   const ret = `${Math.round(color.red)},${Math.round(color.green)},${Math.round(color.blue)}`
   submit(ret)
}


const isKnownWord = computed(() =>
   state.entry && !state.entry.isNullWord
)
</script>


<template>
   <div v-if="!disabled" :class="[$style.prompt, $theme.prompt]" v-keymap @keydown="onPromptSubmit"
      @focusin="onPromptFocus" @focusout="onPromptBlur" v-show="isKnownWord">
      <h2>
         <h3 :title="author">{{ word.name }}</h3>
         <hr>
         <li>{{ word?.brief }}</li>
         <li v-if="word.default">默认值：{{ word.default ?? 'unknown' }}</li>
         <li v-if="word.values">取值：{{ word.values ?? 'unknown' }}</li>
      </h2>

      <!-- 文本类型 -->
      <template v-show="state.type === PromptType.str">
         <p>纯文本类型</p>
      </template>

      <!-- 枚举类型 -->
      <ol :class="$style.enum" v-child-focus="PromptType.enum" v-show="state.type === PromptType.enum">
         <li class="normal-button reactive-hcs" v-for="option in state.options" :key="option.id"
            :selected="state.cursor === option.id && state.isActive" @click="onOptionClick(option.id)"
            @dblclick="onOptionDblClick(option)">
            <span>{{ option.value }}</span>
            <span>{{ option.text }}</span>
         </li>
      </ol>

      <!-- 整数类型 -->
      <ul :class="$style.number" v-show="state.type === PromptType.int">
         <button @mousedown="state.increaseInt(-10)">--</button>
         <button @mousedown="state.increaseInt(-1)">-</button>
         <span @keydown.stop>
            <number-input :value="state.int" @change="onIntSubmit" :min="state.entry?.typeParam.min"
               :max="state.entry?.typeParam.max" v-child-focus="PromptType.int" />
         </span>
         <button @mousedown="state.increaseInt(1)">+</button>
         <button @mousedown="state.increaseInt(10)">++</button>
      </ul>

      <!-- 小数类型 -->
      <ul :class="$style.number" v-show="state.type === PromptType.float">
         <button @mousedown="state.increaseFloat(-0.1)">--</button>
         <button @mousedown="state.increaseFloat(-0.01)">-</button>
         <span @keydown.stop>
            <number-input v-model.lazy="state.float" precision="2" min="0" max="1" v-child-focus="PromptType.float" />
         </span>
         <button @mousedown="state.increaseFloat(0.01)">+</button>
         <button @mousedown="state.increaseFloat(0.1)">++</button>
      </ul>

      <!-- 颜色类型 -->
      <div v-show="state.type === PromptType.color">
         <ColorPicker v-child-focus="PromptType.color" :color="color" @submit="onColorSubmit" />
      </div>

      <footer style="height: 10px;"></footer>
   </div>
</template>
<style scoped src="@css/prompt.scss" module="$theme"></style>
<style scoped lang='scss' module>
.prompt {
   width: fit-content;
   height: fit-content;
   min-width: 300px;
   padding: 10px;

   h2 {
      >* {
         margin: 3px 0;
      }

      h3 {
         padding: 3px 1em;
      }

      hr {
         display: block;
         height: 2px;
         width: 100%;
      }

      li {
         white-space: nowrap;
      }
   }

   text-align: left;
   cursor: default;

   p {
      height: 50px;
   }
}

.enum {
   /* padding: 15px; */

   >li {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      margin: 6px;
   }
}

.number {
   display: flex;
   padding: 0.5ch 1ch;
   margin: 0.5ch;
   text-align: center;
   align-items: center;
   height: 3em;

   span {
      display: block;
      flex: 1;
      height: 100%;
      margin: 0 4px;
   }

   number-input {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      padding: 4px 10px;
   }

   button {
      flex: 0;
      display: inline-block;
      height: 100%;
      aspect-ratio: 1;
   }
}
</style>
