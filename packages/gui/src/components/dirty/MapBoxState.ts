import { reactive, ref } from "vue"

export interface Data {
   id: number,
   key: string,
   val: string,
   validated: boolean,
   [s: string]: any
}
export function useData(map: Record<string, any>) {
   const data: Data[] = reactive([])
   for (let key in map) {
      data.push({
         id: data.length,
         key,
         val: map[key],
         validated: true
      })
   }

   const newKey = ref<HTMLElement>()
   const newVal = ref<HTMLElement>()
   function setNew(key: string, val: string) {
      if (newKey.value) newKey.value.innerText = key
      if (newVal.value) newVal.value.innerText = val
   }

   function getNew() {
      return {
         key: newKey.value?.innerText ?? '',
         val: newVal.value?.innerText ?? ''
      }
   }

   function addNewOne() {
      const { key, val } = getNew()
      setNew('', '')
      data.push({
         id: data.length,
         key,
         val,
         validated: true
      })
      map[key] = val
   }

   function alterKeyAt(order: number, newKey: string) {
      const item = data[order]
      if (!item) return
      map[newKey] = item.val
      if (newKey !== item.key) delete map[item.key]
      item.key = newKey
   }

   function alterValAt(order: number, newVal: string) {
      const item = data[order]
      if (!item) return
      map[item.key] = newVal
      item.val = newVal
   }

   function deleteAt(order: number) {
      delete map[data[order].key]
      data.splice(order, 1)
   }

   return {
      data,
      newKey,
      newVal,
      addNewOne,
      alterKeyAt,
      deleteAt,
      alterValAt,
      getNew,
      setNew
   }
}
