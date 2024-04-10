<script lang='ts' setup>
import { Directive, computed, ref, watch } from 'vue';

import { useKeyMap } from '@/hooks/keymap';
import { FlexInput } from '@ra2inier/wc';
import { useFolder } from '@/hooks/folder';

const props = defineProps({
   alias: { type: Array<string>, default: [] },
   values: { type: Array<string>, required: true },
   modelValue: { default: '' },
   input: { type: Boolean, default: false },
   default: { type: String, default: '?' }
})

const cursor = ref(-1)
watch(() => props.modelValue, () => {
   const vs = props.values, as = props.alias, mv = props.modelValue
   cursor.value = -1
   for (let i = 0; i < vs.length; ++i) {
      if (vs[i] === mv || as[i] === mv) {
         cursor.value = i; break
      }
   }
}, { immediate: true })
const cursorValue = computed(() => props.alias[cursor.value] || props.values[cursor.value] || props.default)
const emit = defineEmits(['update:model-value'])
function submitById(id: number) {
   emit('update:model-value', props.values[id])
}

function onInputChange(e: Event) {
   const newValue = (<FlexInput>e.target).value
   const len = props.values.length
   cursor.value = -1
   for (var index = 0; index < len; index++) {
      if (props.values[index] === newValue) {
         submitById(index)
         break
      }
   }
   cursor.value = index
}

const vFocus: Directive<HTMLElement> = { mounted(el) { el.focus() } }

function onItemClick(id: number) {
   submitById(id)
   cursor.value = id
   folded.value = true
}
const vKeymap = useKeyMap({
   arrowup() {
      cursor.value = (cursor.value - 1 + props.values.length) % props.values.length
      submitById(cursor.value)
   },
   arrowdown() {
      cursor.value = (cursor.value + 1) % props.values.length
      submitById(cursor.value)
   },
   enter() {
      folded.value = true
   }
}, { prevent: true })

const { folded, vFolder } = useFolder()
</script>


<template>
   <div :class="[$style.enumbox, $theme.enumbox]" v-focus v-keymap @focusout="folded = true">
      <s v-folder>&gt;</s>
      <flex-input v-if="input" class="normal-input" :value="cursorValue" @click="folded = !folded"
         @change="onInputChange" />
      <span v-else class="normal-input" @click="folded = !folded">{{ cursorValue }}</span>
      <ol v-show="values.length > 0 && !folded" class="normal-rpanel scroll">
         <li v-for="(item, order) in values" class="reactive-hcs" :selected="cursor === order"
            @click="onItemClick(order)" :key="order">
            {{ alias[order] || item }}
         </li>
      </ol>
   </div>
</template>

<style scoped lang="scss" module>
.enumbox {
   display: inline-block;
   position: relative;
   height: 100%;
   width: fit-content;

   ol {
      position: absolute;
      z-index: 999;
      top: 100%;
      height: fit-content;
      max-height: 400px;
      min-width: 8em;
      padding: align-size(normal) 0;
   }

   span {
      display: inline-block;
      height: 100%;
      text-align: center;
   }

   li {
      padding: 0 align-size(normal);
   }


}
</style>
<style module="$theme" lang="scss">
.enumbox {
   li {
      background-color: inherit;
   }
}
</style>
