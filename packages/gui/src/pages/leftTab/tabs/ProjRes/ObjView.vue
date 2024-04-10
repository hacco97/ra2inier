<script lang='ts' setup>
import { computed, ref, StyleValue, watchEffect } from 'vue';
import iniSvg from '@/asset/icons/ini.svg?raw'
import addonSvg from '@/asset/icons/addon.svg?raw'
import { setStatus } from '@/pages/footer/state';
import { IniObjectRo } from '@ra2inier/core';
import { useObjectCtxmenu, CtxItem } from './objectCtxmenu'
import { useProjectStore } from '@/stores/projectStore';

const props = defineProps<{ object: IniObjectRo, readonly?: boolean }>()
const emit = defineEmits(['open'])
const object = ref(props.object)
watchEffect(() => { object.value = props.object })
const ctxItem: CtxItem = {
   object: object.value,
   openHandle() { emit('open', props.object) }
}
const store = useProjectStore()
const vCtxmenu = props.readonly ? {} : useObjectCtxmenu(store.mainKey)

function onMouseEnter(msg: string) { setStatus(msg) }

const isSubitemShowed = ref(false)
const rotateStyle = computed<StyleValue>(() => ({
   rotate: isSubitemShowed.value ? '90deg' : '0deg'
}))

</script>


<template>
   <div :class="$style.objview" v-ctxmenu="ctxItem">
      <h2 @click="isSubitemShowed = !isSubitemShowed" @mouseenter="onMouseEnter(object.fullname)" class="list-item">
         <q :style="rotateStyle" class="folder" :folded="!isSubitemShowed">&gt;</q>
         <p v-svgicon="iniSvg" padding="15%"></p>
         <span :title="object.fullname" class="vertical-center">
            <i>{{ object.name }}</i><i>.</i>
            <i>{{ object.scope }}</i>
         </span>
      </h2>
      <ul v-show="isSubitemShowed">
         <li v-for="sub in object.inline" class="list-item">
            <p v-svgicon="addonSvg" padding="0"></p>
            <span>{{ sub }}</span>
         </li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
$line-height: line-height(tiny);
$padding: align-size(large);

.objview {
   line-height: $line-height;
   white-space: nowrap;

   h2 {
      padding-left: $padding;

      span {
         display: inline-block;
         height: 100%;
         text-align: center;
      }

      q {
         text-align: center;
         transition: rotate 0.5s ease;
      }
   }

   p {
      display: inline-block;
      height: 1lh;
      aspect-ratio: 1;
   }

   li {
      padding-left: 2em;
      height: $line-height;
   }
}
</style>
