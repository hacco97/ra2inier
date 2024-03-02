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
   <ul :class="[clazz, $style['list-box']]">
      <span>[</span>
      <span v-for="(item, order) in data" :key="order">
         <i v-keymap="order" v-focus="order" :disabled="disabled" v-text="item.val" :contenteditable="!disabled"
            @focus="focus.setCurrent(order)" @blur="onBlur($event, order)" :tabindex="tabindex"
            :class="[$style.input, $theme.input]"></i>
         <b>{{ order == data.length - 1 ? '' : ',' }}</b>
      </span>
      <span v-if="!disabled">
         <em>+</em>
         <s v-nkeymap v-focus="data.length" :disabled="disabled" :contenteditable="!disabled" ref="theNew"
            :tabindex="tabindex" :class="[$style.input, $theme.input]"></s>
      </span>
      <span>]</span>
   </ul>
</template>

<style scoped lang="scss" module="$theme">
.input {
   @include plane-radius(normal);
   @include plane-color(normal);

   &[disabled=true] {
      user-select: text;
      background-color: inherit;
   }

   &:focus {
      filter: brightness(1.3);
   }
}
</style>
<style scoped lang='scss' module>
$height: line-height(small);
$min-width: 60px;

.list-box {
   display: flex;
   flex-wrap: wrap;
   vertical-align: middle;
   user-select: text;

   span {
      height: $height;
      line-height: $height;
      margin-right: align-size(normal);
   }

   .input {
      display: inline-block;
      position: relative;
      z-index: auto;
      height: 100%;
      min-width: $min-width;
      padding: 0 align-size(normal);
      text-align: center;


      &[disabled=true] {
         min-width: fit-content;
         padding: 0;
      }
   }

   b {
      display: inline-block;
      height: $height;
      width: fit-content;
      vertical-align: top;
   }

}
</style>
