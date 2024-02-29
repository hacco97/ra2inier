<script lang='ts' setup>
import { ref, shallowReactive } from 'vue';

const list = shallowReactive([
   { name: 'zs', age: 18 },
   { name: 'ls', age: 42 },
   { name: 'ww', age: 67 },
])


function onTestClick(e: MouseEvent) {
   list[0].age++
   console.log(list[0])
}

function onTest2Click(e: MouseEvent) {
   new Promise((solve) => {
      var a: any
      new Promise((s) => {
         var b: any
         b.dd
         s(b)
      })
      console.log(a.sd)
      solve(a)
   }).catch(e => console.log(e)
   )
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
      padding: align-size(normal);
   }

   span {
      padding: align-size(large);
   }
}
</style>
