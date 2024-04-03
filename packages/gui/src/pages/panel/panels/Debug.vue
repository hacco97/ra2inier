<script lang='ts' setup>
import { defineStore } from 'pinia';
import { reactive, readonly, ref } from 'vue';

const useStore = defineStore('demo-store', () => {
   const name = ref('zs')
   const age = ref(32)

   const rd = reactive({
      a: 'zs',
      b: 32
   })
   setInterval(() => { rd.b++ }, 1234)

   return {
      name,
      age,
      rd: readonly(rd)
   }
})

const store = useStore()

// store.age=34

const onClick = () => {

   const a = 13
   const b = a + 3

   return
}

</script>


<template>
   <div @click="onClick">
      {{ store.rd }}
   </div>
</template>

<style module scoped lang='scss'></style>
