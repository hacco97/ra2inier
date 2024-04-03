<script lang='ts' setup>
import { computed } from 'vue';
import closeSvg from '@/asset/icons/close.svg?raw';
import { PopupBox } from '@ra2inier/wc';
import { EmitType, IItem, Item } from './ListViewState';

const props = defineProps({
   list: { type: Array<Partial<IItem>>, required: true },
   deleteButton: { type: Boolean, default: true },
   checkBox: { type: Boolean, default: true },
   selectable: { type: Boolean, default: true },
})

const data = computed(() => props.list.map(x => new Item(x)))

defineExpose({
   get value(): Partial<IItem>[] {
      return data.value.map(x => ({
         value: x.value,
         selected: x.selected
      }))
   }
})

const emit = defineEmits<{
   select: EmitType,
   delete: EmitType
}>()


function onDeleteClick(item: Item, order: number) {
   emit('delete', item, order)
}
</script>


<template>
   <div :class="[$style.list, $theme.list]" @select.stop>
      <header>
         <slot></slot>
      </header>
      <section>
         <li v-for="(item, order) in data" class="reactive-h">
            <input v-if="checkBox" type="checkbox" class="normal-button" :id="item.id" v-model="item.selected"
               @change="emit('select', item, order)" :disabled="!selectable" :selected="item.selected">
            <popup-box>
               <label :for="item.id">
                  <span>{{ item.value }}</span>
                  <u v-if="item.detail">({{ item.detail }})</u>
               </label>
               <pre slot="pop" class="popup" v-if="item.popup" v-html="item.popup"></pre>
            </popup-box>
            <i></i>
            <s v-if="deleteButton" @click="onDeleteClick(item, order)" v-svgicon="closeSvg" class="normal-button"></s>
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
      min-width: 15em;
   }

   popup-box {

      text-align: left;
   }

   u {
      font-size: 0.8em;
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
      height: 0.7lh;
      aspect-ratio: 1;
   }
}
</style>
