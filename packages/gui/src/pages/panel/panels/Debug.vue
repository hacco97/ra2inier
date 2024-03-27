<script lang='ts' setup>
import { markRaw, reactive, readonly } from 'vue';

import { PanelParam } from '@/states/panelList';


const props = defineProps<{ param: PanelParam }>()

const user = reactive({
   name: 'zs',
   age: 19,
   son: markRaw({
      name: 'ls',
      age: 3
   })
})

const rUser = readonly(user)


</script>


<template>
   <div :class="$style.debug">
      {{ rUser }}
   </div>
</template>

<style module scoped lang='scss'>
.debug {
   position: relative;
   display: flex;
   flex-direction: column;
   min-height: 1em;
   // background: rgb(183, 149, 149);

   input {
      // user-select: none;
      pointer-events: none;
   }

   section {
      user-select: none;
   }

   h1 {}

   h1:hover+ul {

      section {
         transform: translate(0, 0);
      }
   }

   ul {
      top: 1lh;
      position: absolute;
      overflow: hidden;
      pointer-events: none;

      section {
         transform: translate(0, -100%);
         transition: all 0.4s ease;
         background: pink;
      }
   }
}
</style>
