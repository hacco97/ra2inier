
const map = new Map<string, Memo>()
const fMap = new Map<Function, string>()


/**
 * 缓存选项
 */
export interface MemoOption {
   key: string,
   expires: number,
   depends: any[]
}


interface Memo extends MemoOption {
   data: any,
   caller: () => any
}


const DEFAULT_OPTION = {
   /**
    * 默认15分钟过期
    */
   expires: 1000 * 60 * 15,
   depends: []
}

/**
 * 立即执行一个函数，并缓存和获取其值，可以设置缓存选项，控制缓存行为，
 * 该缓存是懒缓存，只有当获取的时候才会计算值
 * expires设置过期时间，若果过期则重新计算值
 * depends设置依赖数组，只要当依赖数组改变之后，则重新计算缓存
 */
export function useComputed(caller: () => any, option: Partial<MemoOption> = {}) {
   const tmp = <Memo>{
      ...DEFAULT_OPTION,
      ...option,
      key: fMap.get(caller)
   }
   if (!tmp.key) fMap.set(caller, tmp.key = Math.random() + '')
   const memo = map.get(tmp.key)
   if (memo && Date.now() < memo.expires) {
      let isSame = true
      try {
         for (let i = 0; i < memo.depends.length; ++i) {
            if (tmp.depends[i] !== memo.depends[i]) {
               isSame = false
               break
            }
         }
      } catch (error) { isSame = false }
      if (isSame) return map.get(tmp.key)!.data
   }
   tmp.data = caller()
   tmp.expires += Date.now()
   tmp.caller = caller
   map.set(tmp.key, tmp)
   return tmp.data
}


/**
 * 令缓存失效，
 * 不传删除所有缓存
 * 传入string精准失效一个，
 * 传入Function精准失效一个，
 * 传入正则表达式则匹配所有，匹配成功的则删除
 */
export function expire(target?: string | RegExp | Function) {
   if (typeof target === 'string') return map.delete(target)
   if (typeof target === 'function') {
      const key = fMap.get(target)
      key && map.delete(key)
      return fMap.delete(target)
   }
   if (!target) return map.clear()
   for (const key of map.keys()) {
      if (key.match(target)) map.delete(key)
   }
}

/**
 * 使用一个函数作为数据源，返回一对取值函数，get时将会调用数据源函数，如果计算过该值则返回缓存
 * 为了防止不可预估的行为，该函数应当尽量选择为纯函数，或者是只读脏函数
 */
export function useMemo<T, A extends any[]>(
   sourceFunction: (...args: A) => T,
   getKey?: (...args: A) => string,
   expiresTime?: number,
) {

   const map = new Map<string, T>()
   const timeout = new Map<any, number>()
   expiresTime || (expiresTime = 1000 * 60 * 15)
   const _getKey = getKey || ((...x: A) => <string>x[0])

   return {
      get(...args: A) {
         const key = _getKey(...args)
         if (map.has(key) && (Date.now() - timeout.get(key)!) < expiresTime!)
            return map.get(key)!
         timeout.set(key, Date.now())
         const newOne = sourceFunction(...args)
         map.set(key, newOne)
         return newOne
      },
      expire(key: string | RegExp) {
         if (typeof key === 'string') {
            map.delete(key)
            timeout.delete(key)
         } else {
            for (const _key of map.keys()) {
               if (_key.match(key)) map.delete(_key)
            }
         }
      }
   }
}
