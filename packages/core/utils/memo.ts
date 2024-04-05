/**
 * 使用一个函数作为数据源，返回一对取值函数，get时将会调用数据源函数，如果计算过该值则返回缓存
 * 为了减少不可预测的行为，该函数应当尽量选择为纯函数，或者是只读脏函数
 */
export function useMemo<T, A extends any[]>(
   sourceFunction: (...args: A) => T,
   getKey?: (...args: A) => string,
   expiresTime?: number,
) {
   const map = new Map<string, T>()
   const timeout = new Map<any, number>()
   expiresTime || (expiresTime = Number.MAX_SAFE_INTEGER)
   const _getKey = getKey || ((...x: A) => <string>x[0])

   return [
      function get(...args: A) {
         const key = _getKey(...args)
         if (map.has(key) && (Date.now() - timeout.get(key)!) < expiresTime!)
            return map.get(key)!
         const newOne = sourceFunction(...args)
         map.set(key, newOne)
         timeout.set(key, Date.now())
         return newOne
      },
      function set(key: string, val: T) {
         map.set(key, val)
         timeout.set(key, Date.now())
         return val
      },
      function expire(key: string | RegExp) {
         if (typeof key === 'string') {
            map.delete(key)
            timeout.delete(key)
         } else {
            for (const _key of map.keys()) {
               if (_key.match(key)) map.delete(_key)
            }
         }
      },
   ] as const
}

/**
 * 使用一个函数作为数据源，返回一对取值函数，get时将会调用数据源函数，如果计算过该值则返回缓存
 * 为了减少不可预测的行为，该函数应当尽量选择为纯函数，或者是只读脏函数
 */
export function useMemoAsync<T, A extends any[]>(
   sourceFunction: (...args: A) => Promise<T>,
   getKey?: (...args: A) => string,
   expiresTime?: number,
) {
   const map = new Map<string, T>()
   const timeout = new Map<any, number>()
   expiresTime || (expiresTime = 1000 * 60 * 15)
   const _getKey = getKey || ((...x: A) => <string>x[0])

   return [
      async function get(...args: A) {
         const key = _getKey(...args)
         if (map.has(key) && (Date.now() - timeout.get(key)!) < expiresTime!)
            return map.get(key)!
         timeout.set(key, Date.now())
         const newOne = sourceFunction(...args)
         map.set(key, await newOne)
         return newOne
      },
      function set(key: string, val: T) {
         map.set(key, val)
         timeout.set(key, Date.now())
         return val
      },
      function expire(key: string | RegExp) {
         if (typeof key === 'string') {
            map.delete(key)
            timeout.delete(key)
         } else {
            for (const _key of map.keys()) {
               if (_key.match(key)) map.delete(_key)
            }
         }
      }
   ] as const
}

/**
 * 创建一个自主清除副作用的脏函数，函数调用的副作用将会在函数下一次调用时清除
 * @param effect 带有副作用的函数，该函数需要返回其值，并且附带一个清除该次调用产生的副作用的clear函数
 */
export function useEffect<A extends any[], R>(effect: ((...args: A) => [R, () => void])) {
   let prev: Function
   return (...args: A) => {
      if (prev) prev()
      const tmp = effect(...args)
      prev = tmp[1]
      return tmp[0]
   }
}

/**
 * 将一个工厂函数包装为一个单例对象工厂函数
 * @returns [factoryFn: typeof factory, expire: ()=>void]
 */
export function useSingleton<A extends any[], R, L extends (...args: A) => R>(factory: L): L
export function useSingleton<A extends any[], R, L extends (...args: A) => R>(factory: L, withHandler: false): L
export function useSingleton<A extends any[], R, L extends (...args: A) => R>(factory: L, withHandler: true): [L, () => void]
export function useSingleton<A extends any[], R>(factory: (...args: A) => R, withHandler?: boolean): any {
   let r: R | undefined
   const ret = (...args: A) => {
      if (!r) r = factory(...args)
      return r
   }
   if (!withHandler) return ret
   return [ret, () => r = undefined]
}
