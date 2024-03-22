<script lang='ts' setup>
import { reactive, ref } from 'vue';

import { PanelParam } from '@/states/panelList';
import { useMemo } from '@ra2inier/core';
import { useArrayMap } from '@vueuse/core';

const props = defineProps<{ param: PanelParam }>()

const list = ref(['123', '23', '132', '123'])

const f = useMemo(x => {
   console.log(x, 'create')
   return {
      name: x,
      age: Math.random()
   }
})

const list2 = useArrayMap(list, f.get)

const user = {
   name: 'zs',
   age: 38,
   son: {
      name: 'ls',
      age: 12
   },
   ds: undefined
}

const r = reactive(user)



</script>


<template>
   <div :class="$style.debug">
      <h1>hover me</h1>
      <ul>
         <section>
            <li>afs</li>
            <li>afs</li>
            <li>afs</li>
            <li>afs</li>
         </section>
      </ul>
      <h2>dsvz</h2>
      <input disabled="true" contenteditable="false" type="text" value="dfccxva">
      <section contenteditable="false">dfgdfs</section>
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
