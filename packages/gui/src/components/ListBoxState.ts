import { reactive } from "vue"

export interface Data {
   id: number,
   val: string,
   validated: boolean
}

export function useData(list: string[]) {
   const data: Data[] = reactive([])

   for (let val of list) {
      data.push({
         id: data.length,
         val,
         validated: true
      })
   }

   function deleteAt(order: number) {
      data.splice(order, 1)
      list.splice(order, 1)
   }

   function addNewOne(newVal: string) {
      data.push({
         id: data.length,
         val: newVal,
         validated: true
      })
      list.push(newVal)
   }

   function alterAt(order: number, val: string) {
      if (data[order]) {
         data[order].val = val
         list[order] = val
      }
   }

   return {
      data,
      deleteAt,
      addNewOne,
      alterAt
   }
}

