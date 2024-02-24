import { enhance } from './';

/**
 * 尝试执行一个函数
 */
export function tryExec<T>(exec: () => T, callback?: () => any) {
   try {
      return exec()
   } catch (error) {
      return callback?.()
   }
}

/**
 * 从一个字符串中导入模块
 */
export async function importString<T>(str: string) {
   const mod = {}
   const url = URL.createObjectURL(new Blob([str], { type: 'text/javascript' }))
   try { enhance(mod, (await import(/* @vite-ignore */url)).default) }
   catch (e) { console.log(e) }
   URL.revokeObjectURL(url)
   return mod as T
}

/**
 * 从一个对象中删除符合条件的数据
 */
export function removeFrom<T extends any>(object: Record<any, T>, predicate: (x: T) => boolean): void
/**
 * 从一个数组中删除符合条件的数据
 */
export function removeFrom<T extends any>(array: T[], predicate: (x: T) => boolean): void
export function removeFrom<T extends any>(arrayOrObject: T[] | Record<any, T>, predicate: (x: T) => boolean): void {
   if (arrayOrObject instanceof Array) {
      for (let i = 0; i < arrayOrObject.length;) {
         if (predicate(arrayOrObject[i]))
            arrayOrObject.splice(i, 1)
         else i++
      }
   } else {
      for (const key in arrayOrObject) {
         if (predicate(arrayOrObject[key]))
            delete arrayOrObject[key]
      }
   }
}

/**
 * 从一个脚本的字符串创建一个函数，该函数可以执行该脚本
 * @param returns 规定可以从脚本的局部作用域中返回的变量的名称，返回值在函数调用后以一个对象集合的形式返回
 * @returns function(): Record<string, any>
 */
export function safeScript(script: string, returns?: string[]) {
   const returnString = returns instanceof Array ? returns.join(',') : ''
   const vars = returnString ? 'var ' + returnString : ""
   return new Function(`
      "use strict";
      var global, globalThis, self, window;
      ${vars};
      return (()=>{
         ${script};
         return { ${returnString} }
      })()
   `)
}
