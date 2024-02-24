
export type Constructor = new (...args: any[]) => any
export type Key = string | symbol


// 注册信息类型Entry
export interface Info { [s: string]: any }
export class Info {
   key: Key = ''
   // 注册类型的原型对象
   prototype: Record<Key, any> = {}
   // 注册类的所有注册方法注册名字：方法原名
   mapping: Record<Key, string> = {}
   // 注册的方法原名：其对应的参数注册信息
   param: Record<string, string[]> = {}

   // controller的标志
   isController?: boolean
   //测试类的标志
   tests: Record<Key, RequestOptions[]> = {}
   // task任务的注册位置
   task?: Task[]
   // 程序结束后，最后回调函数的注册位置
   final?: string[]

   constructor(prototype: object) {
      this.prototype = prototype
   }

   /**
    * 通过函数的注册名得到函数
    */
   method(fKey: Key): Function {
      return this.prototype[this.mapping[fKey]]
   }
}

export class Task {
   interval: number
   fname: Key

   constructor(fname: Key, interval: number) {
      this.fname = fname
      this.interval = interval
   }
}


export class ControllerCtx {
   info: Info
   instance: any
   declare method: Function
   declare fKey: Key
   declare paramInfo: string[]
   declare isTest: boolean

   constructor(info: Info, instance: any,) {
      this.info = info
      this.instance = instance
   }

   // 调用服务处理函数controller
   async call(options: Record<string, any>) {
      const param: any[] = await []
      const paramInfo = this.paramInfo ?? []
      for (let i = 0; i < this.method.length; ++i) {
         param[i] = paramInfo[i] ? options[paramInfo[i]] : options
      }
      if (param.length === 0) param.push(options)
      return this.method.apply(this.instance, param)
   }

   // 调用服务处理函数controller
   async test(options: Record<string, any>) {
      if (!this.isTest) return false
      const testResult: any[] = await []
      for (const test of this.info.tests[this.fKey]) {
         const r = {
            status: true,
            res: undefined,
            options: test
         }
         testResult.push(r)
         this.call({
            ...options,
            ...test
         }).then((res) => {
            r.res = res
         }).catch((reason) => {
            r.status = false
            r.res = reason
         })
      }
      return testResult
   }
}
