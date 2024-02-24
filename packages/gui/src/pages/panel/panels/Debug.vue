<script lang='ts' setup>
import { ref, shallowReactive } from 'vue';

const user = {
   name: 'zs',
   age: 18
}

const list = shallowReactive([
   { name: 'zs', age: 18 },
   { name: 'ls', age: 42 },
   { name: 'ww', age: 67 },
])


interface MouseEvent extends globalThis.MouseEvent {
   lover?: string
}

function onTestClick(e: MouseEvent) {
   list[0].age++
   console.log(list[0])
   e.lover = 'zs'
}

function onTest2Click(e: MouseEvent) {
   console.log(e.lover)
}
</script>


<template>
   <div class="text-center" @click="onTest2Click">
      <button @click="onTestClick">test</button>
      <li v-for="item in list">
         <span>{{ item.name }}</span>
         <span>{{ item.age }}</span>
      </li>
   </div>
</template>

<style scoped lang='scss'>
div {
   width: 200px;
   height: 200px;
   background-color: aliceblue;

   button {
      width: 100px;
      height: 100px;
      background-color: red;
   }

   li {
      padding: 1ch;
   }

   span {
      padding: 1em;
   }
}
</style>
