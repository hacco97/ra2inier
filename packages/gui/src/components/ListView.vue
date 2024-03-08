<script lang='ts' setup>
import { computed, reactive } from 'vue';

import closeSvg from '@/asset/icons/close.svg?raw';
import { PopupBox } from '@ra2inier/wc';

const props = defineProps({
   list: { type: Array<string>, required: true },
   popups: { type: Array<string>, required: false },
   deleteButton: { type: Boolean, default: true },
   checkBox: { type: Boolean, default: true }
})

const emit = defineEmits<{
   select: [id: number, value: string]
}>()

class Item {
   id = ''
   value = ''
   selected = false

   constructor(x: string) {
      this.value = x
      this.id = "(list-view-item):" + Math.floor(Math.random() * Date.now())
   }
}

const data = computed(() => reactive(props.list.map(x => new Item(x))))

defineExpose({
   get value() {
      return data.value.map(x => x.value)
   }
})

function onSelectChange(item: Item, order: number) {
   if (item.selected) {
      emit('select', order, item.value)
   }
}

function onDeleteClick(order: number) {
   data.value.splice(order, 1)
}
</script>


<template>
   <div :class="[$style.list, $theme.list]">
      <header>
         <slot></slot>
      </header>
      <section>
         <li v-for="(item, order) in data" class="reactive-h">
            <input v-if="checkBox" type="checkbox" class="normal-button" :id="item.id" v-model="item.selected"
               :selected="item.selected" @change="onSelectChange(item, order)">
            <label :for="item.id">
               <popup-box>
                  {{ item.value }}
                  <pre slot="pop" class="popup" v-if="popups && popups[order]" v-text="popups[order]"></pre>
               </popup-box>
            </label>
            <i></i>
            <s v-if="deleteButton" v-svgicon="closeSvg" class="normal-button" @click="onDeleteClick(order)"></s>
         </li>
      </section>
      <footer>
         <slot name="footer"></slot>
      </footer>
   </div>
</template>

<style module="$theme" scoped lang="scss">
.list {

   input::after {
      background-color: info-color(detail);
   }
}
</style>

<style module scoped lang='scss'>
.list {
   width: 100%;

   header {
      position: relative;
      z-index: 40;
      height: fit-content;
   }

   section {
      position: relative;
      z-index: 30;
   }

   footer {
      position: relative;
      z-index: 1;
   }

   &>*:hover {
      z-index: 888;
   }

   li {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: inherit;
      height: 1lh;
   }

   input {
      position: relative;
      display: block;
      width: 1em;
      flex: 0;
      height: 1em;
      aspect-ratio: 1;
   }

   input::after {
      position: absolute;
      inset: 25%;
      width: 50%;
      height: 50%;
      border-radius: inherit;
   }

   input[selected=true]::after {
      content: '';
   }

   input,
   label {
      margin-right: align-size(normal);
   }

   label {
      flex: 0 0 auto;
      display: inline-block;
      height: 100%;
   }

   popup-box {
      min-width: 15em;
      text-align: left;
   }

   pre {
      position: relative;
      z-index: 100;
   }

   i {
      flex: 1;
   }

   s {
      flex: 0;
      height: 0.9lh;
      aspect-ratio: 1;
   }
}
</style>
