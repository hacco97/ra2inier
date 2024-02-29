<script lang='ts' setup>
import { reactive, ref } from 'vue';

import { exec } from '@/boot/apis';

const toCalls: string[] = reactive([])
const res = ref<any>({})

exec<string[]>('debug/apis').then((res) => {
   if (res.status) {
      for (let i of res.data) {
         toCalls.push(i)
      }
   }
})

function onClick(command: string) {
   exec<any>(command,).then((r) => {
      res.value = r
   })
}

function onKeydown(e: KeyboardEvent, command: string) {
   if (e.key === 'Enter') {
      onClick(command)
   }
}

</script>


<template>
   <div :class="[$style.api]" class="scroll">
      <ul>
         <li class="list-item" v-for="(command, key) in toCalls">
            <input class="rd c-bg-l" type="text" v-model="toCalls[key]" @keydown="onKeydown($event, command)">
            <button @click="onClick(command)">call</button>
         </li>
      </ul>
      <div><span>状态：</span><span>{{ res.status }}</span></div>
      <pre><span>结果：</span><span>{{ res.data }}</span></pre>
      <footer></footer>
   </div>
</template>

<style lang="scss" scoped module>
.api {
   ul {
      columns: 5;
      column-width: 300px;
   }

   input {
      padding: align-size(tiny) 5px;
   }

   button:hover {
      filter: brightness(2) saturate(2);
   }

   div {
      margin: 10px 0;
   }

   footer {
      height: 500px;
      width: 100%;
   }

}
</style>
