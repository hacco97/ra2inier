<script lang='ts'>
import { defineComponent, shallowReactive, watch } from 'vue'
export class Selector {
   base = ''
   value = ''
   selectedID = -1
   list: string[] = []
   remark: string[] = []

   SUBMIT_CTRL = 0

   select(id: number) {
      this.selectedID = id
   }

   selectNext() {
      this.selectedID = (this.selectedID + 1) % this.list.length
   }

   selectPrev() {
      this.selectedID = (this.selectedID - 1 + this.list.length) % this.list.length
   }

   submit() {
      this.value = this.list[this.selectedID]
      this.SUBMIT_CTRL++
   }
}

export default defineComponent({
   name: 'SelectBox',
   props: {
      selector: {
         required: true,
         type: Selector
      }
   },
   emits: ['focus', 'submit', 'esc', 'blur', 'tab'],
   setup(props, { emit }) {
      const selector = props.selector
      const list = shallowReactive(selector.list)

      function onRootFocus() {
         emit('focus')
      }

      function onItemClick(order: number) {
         selector.select(order)
      }

      function onItemDbClick(order: number) {
         selector.select(order)
         selector.submit()
      }

      function onRootBlur() {
         emit('blur')
         selector.select(-1)
      }

      watch(() => selector.SUBMIT_CTRL, () => {
         emit('submit', selector.value)
      })

      function onKeydown(e: KeyboardEvent, id?: number) {
         switch (e.key) {
            case 'ArrowUp':
               selector.selectPrev()
               break
            case 'ArrowDown':
               selector.selectNext()
               break
            case 'Enter':
               selector.submit()
               break
            case 'Escape':
               emit('esc')
               break
            case 'Tab':
               emit('tab')
               break
            default:
         }
         e.preventDefault()
      }

      return {
         list,
         onRootFocus,
         onRootBlur,
         onKeydown,
         onItemClick,
         onItemDbClick
      }
   }
})
</script>


<template>
   <div class="local-enumbox" @focus="onRootFocus" tabindex="-1" @keydown="onKeydown" @blur="onRootBlur">
      <ol v-show="list.length > 0" class="rd">
         <ul class="c-bg-n scroll">
            <li v-for="(item, order) in list" :selected="selector.selectedID === order" @click="onItemClick(order)"
               @dblclick="onItemDbClick(order)" class="list-item c-h-n" :key="order">
               <i>{{ item }}</i>
               <b>{{ selector.remark[order] }}</b>
            </li>
         </ul>
      </ol>
   </div>
</template>

<style scoped lang='scss'>
.local-enumbox {
   position: relative;
   z-index: var(--z-index-ctxmenu);
   width: 100%;
   height: 0px;
   overflow: visible;
   text-align: left;
   cursor: default;

   &:focus>ol {
      outline: var(--color-line-normal) solid 2px;
      outline-offset: -1px;
   }

   ol {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      min-width: fit-content;
   }

   ul {
      min-width: 300px;
      max-height: 300px;

      li {
         display: flex;
         justify-content: space-between;

         &[selected=true] {
            background-color: var(--color-background-highlight);
         }
      }
   }

}
</style>
