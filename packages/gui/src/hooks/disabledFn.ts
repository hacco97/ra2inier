import { Ref, ref } from "vue";


export function useDisabled<T extends any[], K extends Promise<any>>(fn: (...args: T) => K)
   : [(...args: T) => Awaited<K> | undefined, Ref<boolean>]
export function useDisabled<T extends any[], K>(fn: (...args: T) => K)
   : [(...args: T) => K | undefined, Ref<boolean>]
export function useDisabled<T extends any[], K>(fn: (...args: T) => K) {
   let disabled = ref(false)

   async function disabledFn(...args: T): Promise<K | undefined> {
      if (disabled.value) return Promise.resolve(undefined)
      disabled.value = true
      const ret = await fn(...args)
      disabled.value = false
      return ret
   }

   return [disabledFn, disabled] as const
}
