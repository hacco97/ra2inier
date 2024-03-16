<script lang='ts' setup>
import { computed, ref, StyleValue, watchEffect } from 'vue';

import { setStatus } from '@/pages/footer/state';
import { IniObjectRo } from '@ra2inier/core';
import { useObjectCtxmenu, CtxItem } from './objectCtxmenu'

const props = defineProps<{ object: IniObjectRo }>()
const emit = defineEmits(['open'])
const object = ref(props.object)
watchEffect(() => { object.value = props.object })
const ctxItem: CtxItem = {
   object: object.value,
   openHandle() {
      emit('open', props.object)
   }
}
const vCtxmenu = useObjectCtxmenu()

function onTitleDbClick() {
   emit('open', props.object)
}

function onMouseEnter(msg: string) {
   setStatus(msg)
}

const isSubitemShowed = ref(false)
const rotateStyle = computed<StyleValue>(() => ({
   rotate: isSubitemShowed.value ? '90deg' : '0deg'
}))

</script>


<template>
   <div :class="$style.objview" v-ctxmenu="ctxItem">
      <h2 @click="isSubitemShowed = !isSubitemShowed" @dblclick="onTitleDbClick"
         @mouseenter="onMouseEnter(object.fullname)" class="list-item">
         <q :style="rotateStyle" class="folder" :folded="!isSubitemShowed">&gt;</q>
         <span :title="object.fullname" class="vertical-center">
            <i>{{ object.name }}</i><i>.</i>
            <i>{{ object.scope }}</i>
         </span>
      </h2>
      <ul v-show="isSubitemShowed">
         <li v-for="sub in object.inline" class="list-item">{{ sub }}</li>
      </ul>
   </div>
</template>

<style scoped lang='scss' module>
$line-height: line-height(tiny);

.objview {
   line-height: $line-height;
   white-space: nowrap;

   h2 {
      padding-left: align-size(normal);


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

   li {
      padding-left: 2em;
      height: $line-height;
   }
}
</style>
