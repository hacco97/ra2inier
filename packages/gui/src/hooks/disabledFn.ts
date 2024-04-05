import { Ref, ref } from "vue";

/**
 * 返回目标函数的并发限制函数。当一个函数正在运行期间，该函数不可重入。
 */
export function useDisabled<T extends any[], K>(fn: (...args: T) => K)
   : [(...args: T) => Promise<Awaited<K> | undefined>, Ref<boolean>]
export function useDisabled<T extends any[], K>(fn: (...args: T) => K, defaultReturn: K)
   : [(...args: T) => Promise<Awaited<K>>, Ref<boolean>]
export function useDisabled<T extends any[], K>(fn: (...args: T) => K, defaultReturn?: any) {
   let disabled = ref(false)
   async function disabledFn(...args: T): Promise<K | undefined> {
      if (disabled.value) return Promise.resolve(defaultReturn ?? undefined)
      disabled.value = true
      const ret = await fn(...args)
      disabled.value = false
      return ret
   }

   return [disabledFn, disabled] as const
}
