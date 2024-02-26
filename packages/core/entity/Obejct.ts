
// hash值计算逻辑
const SEED = [11.4, 41, 61.2, 13, 7.6, 22.1, 88, 1, 39, 51.4]
const len = SEED.length
function seed(seed: number) { return SEED[seed % len] }
const HASH = Symbol()

/**
 * 对象实例作用域：
 * singleton：单例模式，如果一个项目存在两个该类型的同名对象，将会报错；
 * prototype：多例模式，项目中可以存在多个同名的对象，并且会被同时输出；
 * inherit：继承模式，以引用的项目中的同名对象为准；
 * override：覆盖模式，以本项目中的数值为准；
 */
export type ScopeType = 'singleton' | 'prototype' | 'inherit' | 'override'

export interface IUniqueObject {
   id: number
   seed: number
   name: string
   version: number
   [HASH]?: number
   /**
    * 作用域类型：默认为多例 prototype
    */
   scopeType?: ScopeType
}

export class UniqueObject implements IUniqueObject {
   [key: string | symbol]: any
   id: number
   seed: number
   version: number
   name: string

   constructor(name?: string, seed?: number, version?: number) {
      this.id = Date.now()
      this.seed = Math.ceil(Math.random() * (seed || this.id))
      this.version = version || Date.now()
      this.name = name ?? 'NULL'
   }

   get key() {
      return `${this.id}!${this.seed}`
   }

   get hash() {
      if (this[HASH]) return this[HASH]
      const id = this.id * seed(this.version)
      const version = (this.version << 5) / seed(this.id)
      let hash = Math.abs(id + version)
      while (hash > 999_999) hash /= 9.3
      while (hash < 100_000) hash *= 9.3
      return this[HASH] = Math.floor(hash)
   }

   get fullname() {
      return `${this.name}(${this.hash})`
   }

   update() {
      this.version = Date.now()
      this[HASH] = 0
   }
}

export function isUniqueObject(object: any) {
   if (object)
      if (object.id && object.seed)
         if (typeof object.id === 'number')
            if (typeof object.seed === 'number')
               return true
   return false
}

export interface Entry {
   /**
    * 对应word的名字
    */
   key: string,
   /**
    * word对应的值，可以有多个值，中间用逗号分开
    */
   values: string[],
   /**
    * 给该词条可选的评论
    */
   comment?: string,
   /**
    * 该单词的key值
    */
   wordKey?: string
}

export interface IIniObject extends IUniqueObject {
   // 两级分组
   group: string
   // 记录scope对象的key值
   scope: string
   // 记录词条数据
   entry: Entry[]
   // 记录内联对象的key值
   inline: string[]
   // 记录副本对象的key值
   copy: string[]
   // 记录对象级别的信息
   detail: string
   // 局部变量
   envVariable: Record<string, string>
}

export interface IniObject extends IIniObject { }
export class IniObject extends UniqueObject {
   // 两级分组
   group: string = ''
   // 记录scope对象的key值
   scope: string = ''
   // 记录词条数据
   entry: Entry[] = []
   // 记录内联对象的key值
   inline: string[] = []
   // 记录副本对象的key值
   copy: string[] = []
   // 记录对象级别的信息
   detail = ''
   // 局部变量
   envVariable: Record<string, string> = {}

   constructor(name = 'NEW_INIOBJECT') {
      super(name)
   }
}
