<script lang='ts' setup>
import { computed } from 'vue';

import { useFocus } from '@/hooks/focus';
import { useKeyMap } from '@/hooks/keymap';

import { useData } from './MapBoxState';

const props = defineProps<{
   map: Record<string, any>,
   clazz?: string,
   onValidated?(str: string): boolean,
   disabled: boolean
}>()
const {
   data, newKey, newVal, deleteAt, addNewOne,
   alterKeyAt, alterValAt, getNew, setNew
} = useData(props.map)


const focus = useFocus()
const { setCurrent, focusAt, focusNext, focusPrev, deleteFocus } = focus
const vFocus = focus.directive
const tabindex = computed(() => props.disabled ? -1 : 0)


const vKeymap = useKeyMap({
   enter(e, data: { order: number, keyOrVal: boolean }) {
      if (data.keyOrVal) alterKeyAt(data.order, this.innerText)
      else alterValAt(data.order, this.innerText)
      e.preventDefault()
   },
   arrowup(e) {
      focusPrev()
      e.preventDefault()
   },
   arrowdown(e) {
      focusNext()
      e.preventDefault()
   },
   backspace(e, data: { order: number, keyOrVal: boolean }) {
      if (this.innerText === '') {
         deleteAt(data.order)
         deleteFocus()
         focusPrev()
         if (!data.keyOrVal) focusPrev()
      }
   }
})

const vNkeymap = useKeyMap({
   enter(e, type: string) {
      const { key, val } = getNew()
      if (key === '' && val === '') return
      addNewOne()
      if (type === 'key') focusAt(data.length * 2 - 1)
      else focusAt(data.length * 2 - 2)
   },
   arrowup(e, type: string) {
      if (type === 'key') focusAt(2 * data.length - 1)
      else focusAt(2 * data.length)
   },
   arrowdown(e, type: string) {
      if (type === 'key') focusAt(2 * data.length + 1)
      else focusAt(0)
   }
}, { prevent: true })

function onKeyBlur(e: Event, order: number) {
   const key = (e.target as HTMLElement).innerText.trim()
   alterKeyAt(order, key)
}

function onValBlur(e: Event, order: number) {
   const val = (e.target as HTMLElement).innerText.trim()
   alterValAt(order, val)
}

</script>


<template>
   <div class="scrollx" v-scrolls>
      <ul :class="[clazz, 'clearfix', $style.mapbox]">
         <span>{</span>
         <div v-for="(item, order) in data" :key="order" class="clearfix">
            <span>
               <i v-focus="2 * order" :disabled="disabled" v-text="item.key" :contenteditable="!disabled"
                  @focus="setCurrent(2 * order)" @blur="onKeyBlur($event, order)" v-keymap="{ order, keyOrVal: true }"
                  :tabindex="tabindex"></i>
               <i v-focus="2 * order + 1" :disabled="disabled" v-text="item.val" :contenteditable="!disabled"
                  @focus="setCurrent(2 * order + 1)" @blur="onValBlur($event, order)" v-keymap="{ order, keyOrVal: false }"
                  :tabindex="tabindex"></i>
            </span>
            <b :isLast="order === data.length - 1">;</b>
         </div>
         <span v-if="!disabled">&nbsp;+&nbsp;</span>
         <span v-if="!disabled">
            <em v-focus="2 * data.length" :disabled="disabled" :contenteditable="!disabled" ref="newKey"
               @focus="setCurrent(data.length * 2)" v-nkeymap="'key'" :tabindex="tabindex"></em>
            <em v-focus="2 * data.length + 1" :disabled="disabled" :contenteditable="!disabled" ref="newVal"
               @focus="setCurrent(data.length * 2 + 1)" v-nkeymap="'val'" :tabindex="tabindex"></em>
         </span>
         <span>}</span>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
$height: var(--line-height);

.mapbox {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
   min-width: fit-content;
   padding: 3px;

   >div {
      position: relative;
      z-index: auto;
      margin: 5px 0;
      padding: 0 3px;
      vertical-align: middle;
   }

   span {
      float: left;
      width: fit-content;
      line-height: $height;
      overflow: hidden;
      padding: 0;

      >:first-child {
         border-bottom: solid 1px var(--color-line-normal);
      }
   }

   .local-thenew {
      margin-right: 3px;
   }

   >:last-child {
      padding: {
         left: 3px;
         right: 3px;
      }
   }

   >:first-child {
      padding: 0 3px;

   }

   b {
      float: left;
      height: $height;
      margin: auto 0;
      line-height: calc(1.8*$height);
   }

   b[isLast=true] {
      display: none;
   }

   i,
   em {
      display: block;
      position: relative;
      z-index: auto;
      min-width: 80px;
      height: $height;
      padding: 0 1.1em;
      overflow: visible;
      text-align: center;

      &[disabled=true] {
         background-color: var(--color-background-normal);
      }
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

   i:focus,
   em:focus {
      color: var(--color-text-highlight);
   }

}
</style>
