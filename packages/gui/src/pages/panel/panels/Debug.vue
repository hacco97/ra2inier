<script lang='ts' setup>
import { ref, shallowReactive } from 'vue';

import { PopupBox, TouchButton } from '@ra2inier/wc';

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


function onHiClick(e: Event) {
   console.log(e)
   e.stopPropagation()

}

function onHello() {
   console.log('hello')

}

function onClick(){
   console.log('hi')

}
</script>


<template>
   <div class="text-center">
      <popup-box position="rb">
         <button @click="onTestClick">test</button>
         <p slot="pop">
            <li v-for="item in list">
               <span>{{ item.name }}</span>
               <span>{{ item.age }}</span>
            </li>
            <button @click="onHiClick">hello</button>
         </p>
      </popup-box>
      <touch-button @touch="onHello" @click="onClick">
         hello
      </touch-button>
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

      background-color: palegoldenrod;
   }

   span {
      padding: align-size(large);
   }
}
</style>
