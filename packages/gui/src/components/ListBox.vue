<script lang='ts' setup>
import { computed, Directive, nextTick } from 'vue';

import { useFocus } from '@/hooks/focus';
import { useKeyMap } from '@/hooks/keymap';

import { useData } from './ListBoxState';

const props = defineProps<{
   list: string[],
   clazz?: string,
   onValidated?(str: string): boolean,
   disabled: boolean
}>()
const { deleteAt, addNewOne, alterAt, data } = useData(props.list)

const tabindex = computed(() => props.disabled ? -1 : 0)

function onBlur(e: Event, order: number) {
   const val = (e.target as HTMLElement).innerText
   alterAt(order, val)
}

const focus = useFocus()
const vFocus = focus.directive

const vKeymap: Directive<HTMLElement, number> = useKeyMap({
   enter(e, order: number) {
      nextTick(() => alterAt(order, this.innerText))
      e.preventDefault()
   },
   arrowup(e) {
      focus.focusPrev()
      e.preventDefault()
   },
   arrowdown(e) {
      focus.focusNext()
      e.preventDefault()
   },
   backspace(e, order: number) {
      if (this.innerText === '') {
         deleteAt(order)
         focus.focusPrev()
      }
   }
})

const vNkeymap = useKeyMap({
   enter(e) {
      const newVal = this.innerText
      e.preventDefault()
      if (!newVal) return
      if (props.onValidated && !props.onValidated(newVal)) return
      addNewOne(newVal)
      this.innerText = ''
   },
   arrowup(e) {
      e.preventDefault()
      focus.focusPrev()
   },
   arrowdown(e) {
      focus.focusNext()
      e.preventDefault()
   }
})
</script>

<template>
   <div class="scrollx" v-scrolls>
      <ul :class="[clazz, 'clearfix', $style['list-box']]">
         <span>[</span>
         <span v-for="(item, order) in data" :key="order">
            <i v-focus="order" :disabled="disabled" v-text="item.val" :contenteditable="!disabled"
               @focus="focus.setCurrent(order)" @blur="onBlur($event, order)" v-keymap="order" :tabindex="tabindex"></i>
            <b :isLast="order == data.length - 1">,</b>
         </span>
         <span v-if="!disabled">
            &nbsp;+&nbsp;<em v-focus="data.length" :disabled="disabled" v-nkeymap :contenteditable="!disabled" ref="theNew"
               :tabindex="tabindex"></em>
         </span>
         <span>]</span>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
$height: var(--line-height);

.list-box {
   min-width: fit-content;

   span {
      float: left;
      vertical-align: middle;
      height: $height;
      width: fit-content;
      line-height: $height;
      margin: 5px 0;
      padding: 0 3px;
      overflow: visible;
   }

   i,
   em {
      display: inline-block;
      position: relative;
      z-index: auto;
      min-width: 80px;
      height: 100%;
      padding: 0 1.2em;
      overflow: visible;
      text-align: center;
      vertical-align: middle;

      &[disabled=true] {
         background-color: var(--color-background-normal);
         user-select: text;
      }
   }

   i:focus,
   em:focus {
      color: var(--color-text-highlight);
   }

   b {
      display: inline-block;
      height: $height;
      vertical-align: middle;
   }

   b[isLast=true] {
      display: none;
   }

   i::after {
      // content: '\26A0';
      // content: '\2714';
      position: absolute;
      z-index: auto;
      right: 5px;
      top: -7px;
      color: var(--color-info);
      font-size: var(--font-size-small);
   }

   h4,
   h5 {
      float: left;
      height: $height;
      line-height: $height;
   }

}
</style>
