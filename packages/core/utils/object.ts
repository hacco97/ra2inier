import { cloneDeep, isArrayLikeObject } from 'lodash';

type Constructor<E> = new (...args: any) => E

/**
 * 使用构造函数创建一个新的对象，并将一个平对象中的数据拷贝到该新对象中
 */
export function fromRaw<T extends Constructor<InstanceType<T>>>
   (object: Record<string, any>, constructor: T, deep = false) {
   const temp = new constructor
   for (const key in temp) {
      if (object[key] === undefined) continue
      if (deep && object[key] instanceof Object) {
         temp[key] = cloneDeep(object[key])
      } else {
         temp[key] = object[key]
      }
   }
   return temp
}

/**
 * 拷贝一个对象，将其中的代理对象和函数略过，以生成一个平对象
 */
export function toRaw<T extends Record<string, any>>
   (object: T, template?: Record<string, any>, deep = true) {
   const tmp: Record<string, any> = {}
   template = template || object
   for (const key in template) {
      if (typeof object[key] === 'function') continue
      tmp[key] = object[key]
      if (!deep) continue
      if (isArrayLikeObject(object[key]))
         tmp[key] = toRawArray(object[key])
      else if (object[key] instanceof Object)
         tmp[key] = toRaw(tmp[key], template[key], deep)
   }
   return tmp as T
}

function toRawArray(arr: any[]) {
   if (arr[0] instanceof Object)
      return arr.map((val) => toRaw(val))
   else return arr.slice()
}

export function useToRaw(template: Record<string, any>, deep: boolean) {
   return <T extends Record<string, any>>(object: T) => toRaw(object, template, deep)
}

/**
 * 浅拷贝，将from中的属性拷贝至to中，适用于对象引用不可以改变时，代替{...}语法
 */
export function copy(from: any, to: any) {
   let tmp
   for (const key in from) {
      if (tmp = from[key])
         to[key] = tmp
   }
   return to
}

/**
 * 带类型的克隆
 */
export function cloneTyped<T extends Constructor<InstanceType<T>>>
   (object: any, constructor: T) {
   const temp = new constructor
   const newOne = toRaw(object)
   copy(newOne, temp)
   return temp
}

/**
 * 为一个对象添加属性并且进行TS层面的类型转换
 */
export function enhance<T extends Record<string, any>>(object: Record<string, any>, addons: Record<string, any>) {
   for (const key in addons) {
      if (addons[key] !== undefined)
         object[key] = addons[key]
   }
   return object as T
}

/**
 * 从一个对象排除某些键值并且进行TS层面的类型转换
 */
export function exclude<T extends Record<string, any>>(object: Record<string, any>, keys: string[]) {
   for (let key of keys) delete object[key]
   return object as T
}

/**
 * 遍历一个平对象
 */
export function forIn<T>(object: Record<string, T>, cb: (key: string, val: T) => void) {
   for (const key in object) {
      cb(key, object[key])
   }
}

/**
 * 从一个删除一个key值
 */
export function delKey(object: Record<string, any>, key: string) {
   delete object[key]
}
