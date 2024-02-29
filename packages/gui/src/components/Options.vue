<script lang='ts' setup>
import { Directive, ref } from 'vue';

import { useKeyMap } from '@/hooks/keymap';
import { FlexInput } from '@ra2inier/wc';

const props = defineProps({
   list: { type: Array<any>, default: [] },
   modelValue: { type: String, default: '' },
   input: { type: Boolean, default: true },
})

let cursor = ref(0)
const emit = defineEmits(['update:model-value'])
function submit(id?: number) {
   id || (id = cursor.value)
   emit('update:model-value', props.list[id])
}

function onInputChange(e: Event) {
   const ret = (<FlexInput>e.target).value
   let index = 0
   for (; index < props.list.length; index++) {
      const el = props.list[index];
      if (el === ret) {
         emit('update:model-value', ret)
         break
      }
   }
   cursor.value = index
}

const vFocus: Directive<HTMLElement> = { mounted(el) { el.focus() } }

function onItemClick(id: number) {
   submit(id)
   cursor.value = id
}
const vKeymap = useKeyMap({
   arrowup() {
      cursor.value = (cursor.value - 1 + props.list.length) % props.list.length
      submit(cursor.value)
   },
   arrowdown() {
      cursor.value = (cursor.value + 1) % props.list.length
      submit(cursor.value)
   },
})
</script>


<template>
   <div :class="$style.enumbox" tabindex="-1" v-focus v-keymap>
      <flex-input :value="modelValue" @change="onInputChange" :disabled="!input"></flex-input>
      <ol v-show="list.length > 0" class="scroll">
         <ul>
            <li v-for="(item, order) in list" :selected="cursor === order" @click="onItemClick(order)" :key="order">
               {{ item }}
            </li>
         </ul>
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
      top: 100%;
      height: fit-content;
      min-height: 10em;
      min-width: 8em;
      padding: align-size(large) 0;

      background-color: aqua;
   }

   ul {
      background-color: red;
   }

   li {
      padding: align-size(tiny) align-size(large);

      &:hover {
         background-color: var(--color-bg-3);
         filter: brightness(1.25);
      }

      &[selected=true] {
         background-color: var(--color-background-highlight);
      }
   }
}
</style>
