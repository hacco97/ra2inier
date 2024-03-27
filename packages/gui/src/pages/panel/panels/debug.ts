import { defineStore } from "pinia"
import { reactive, ref } from "vue"



namespace D {
   export let name = 'zs'
   export const age = 19
}

export const DD = reactive(D)

console.log(D)


export const useStore = defineStore('sd', () => {
   const name = ref('zs')
   const age = ref(1)

   function add() {
      age.value += 2
   }

   return {
      name,
      age,
      add
   }
})
