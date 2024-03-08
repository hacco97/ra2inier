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
   alterKeyAt, alterValAt, getNew
} = useData(props.map)


const focus = useFocus(true)
const { setCurrent, focusAt, focusNext, focusPrev, deleteFocus } = focus
const vFocus = focus.directive
const tabindex = computed(() => props.disabled ? -1 : 0)


const vKeymap = useKeyMap({
   enter(e, idata: { order: number, keyOrVal: boolean }) {
      if (idata.keyOrVal) alterKeyAt(idata.order, this.textContent!)
      else alterValAt(idata.order, this.textContent!)
      focusAt(2 * data.length)
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
      if (this.textContent === '') {
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
   const key = (e.target as HTMLElement).textContent!.trim()
   alterKeyAt(order, key)
}

function onValBlur(e: Event, order: number) {
   const val = (e.target as HTMLElement).textContent!.trim()
   alterValAt(order, val)
}

</script>


<template>
   <ul :class="[clazz, $style.mapbox, $theme.mapbox]">
      <b>{</b>
      <template v-for="(item, order) in data" :key="order">
         <span :class="$theme.box">
            <i v-focus="2 * order" :disabled="disabled" v-text="item.key" :contenteditable="!disabled"
               @focus="setCurrent(2 * order)" @blur="onKeyBlur($event, order)" v-keymap="{ order, keyOrVal: true }"
               :tabindex="tabindex"></i>
            <hr>
            <i v-focus="2 * order + 1" :disabled="disabled" v-text="item.val" :contenteditable="!disabled"
               @focus="setCurrent(2 * order + 1)" @blur="onValBlur($event, order)" v-keymap="{ order, keyOrVal: false }"
               :tabindex="tabindex"></i>
         </span>
         <b>{{ order !== data.length - 1 ? ';' : "" }}</b>
      </template>
      <span v-if="!disabled">+</span>
      <b v-if="!disabled" :class="$theme.box">
         <s v-focus="2 * data.length" :disabled="disabled" :contenteditable="!disabled" ref="newKey"
            @focus="setCurrent(data.length * 2)" v-nkeymap="'key'" :tabindex="tabindex"></s>
         <hr>
         <s v-focus="2 * data.length + 1" :disabled="disabled" :contenteditable="!disabled" ref="newVal"
            @focus="setCurrent(data.length * 2 + 1)" v-nkeymap="'val'" :tabindex="tabindex"></s>
      </b>
      <span>}</span>
   </ul>
</template>

<style scoped lang='scss' module="$theme">
.mapbox {

   i,
   s {
      @include plane-color(normal);

      &:focus {
         filter: brightness(1.3);
      }

      &[disabled=true] {
         user-select: text;
         background-color: inherit;
      }
   }

   hr {
      background-color: line-color(normal);
   }
}

.box {
   @include plane-radius(normal);
   overflow: hidden;
}
</style>
<style scoped lang='scss' module>
$height: line-height(small);
$min-width: 60px;

.mapbox {
   display: flex;
   flex-wrap: wrap;
   align-items: center;
   user-select: text;

   b {
      margin-right: align-size(normal);
   }

   i,
   s {
      display: block;
      height: $height;
      line-height: $height;
      min-width: $min-width;
      text-align: center;
      padding: 0 align-size(normal);

      &[disabled=true] {
         min-width: fit-content;
         padding: 0;
      }
   }

   hr {
      height: 1px;
   }
}
</style>
