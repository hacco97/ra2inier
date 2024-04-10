import "reflect-metadata"
import { Container, inject, injectable } from "inversify"
import { addQuitCallback } from "~/boot/final"
import { useLogger } from "~/boot/logger"
import { Constructor, ControllerCtx, Info, Key, Task } from "./ControllerCtx"
import { tryExec } from "@ra2inier/core"

export const PATH_VARIABLE = '_pathVariable'

// ioc增强对象类型
// 用于产生注解工具，进行注解式的声明式编程
export function createIocController() {

   // ioc容器
   const container = new Container({ defaultScope: 'Singleton' })
   // 注册的类的键值：类的原型
   const components: Record<Key, Info> = {}

   let tmp: Map<object, Info> | undefined = new Map()


   function touch(object: object) {
      if (!(tmp!.has(object)))
         tmp!.set(object, new Info(object))
      return tmp!.get(object)!
   }

   // 普通组件的注册逻辑
   /**
    * 注册普通的归属ioc容器管理的对象的类注解
    */
   function component(key: Key): any {
      if (key in components)
         throw Error('重复注册的组件：' + key.toString())
      return (target: Constructor) => {
         container.bind(key).to(target)
         injectable()(target)
         const info = components[key] = touch(target.prototype)
         info.key = key
         return info
      }
   }

   /**
   * 用于注册服务的注解，可以在服务类里使用mapping注解和param注解等
   */
   function controller(key: string): any {
      return (target: Constructor) => {
         const info = component(key)(target)
         info.isController = true
         return info
      }
   }


   /**
    * 用于将一个类注册为工厂类，该类必须实现一个create方法，该方法用于构造一个常量，并注入到容器中
    */
   function factory(key: string) {
      if (key in components)
         throw Error('重复注册的组件：' + key.toString())
      return (target: Constructor) => {
         injectable()(target)
         tryExec(() => {
            container.bind(key).toConstantValue((new target).create())
         }, (e) => { throw Error(`工厂函数'${key}初始化错误：${e}'`) })
         const info = components[key] = touch(target.prototype)
         info.key = key
         return info as any
      }
   }

   /**
    * 用于注册服务处理方法的注解，用于controller类的方法
    */
   function mapping(key: string): any {
      return (target: Record<string, any>/*对象的原型*/, fkey: string /*函数的名字*/, descriptor: any) => {
         const info = touch(target)
         info.mapping[key] = fkey
         return info
      }
   }

   /**
     * 将该类的一个方法注册成为一个测试方法，必须在controller类中有效
     */
   function test(key: string, options: RequestOptions[] = [{}]) {
      return (target: object, fkey: string, descriptor: any): any => {
         const info: Info = mapping(key)(target, fkey, descriptor)
         info.tests[key] = options
         return info
      }
   }


   /**
    * 指定一个服务处理函数的参数的键值，在传进来的options————一个RequestOptions对象中的键值，可以在调用时注入给服务处理函数
    */
   function param(paramKey: string): any {
      return (target: object, fkey: string, paramId: number) => {
         const info = touch(target)
         if (!info.param[fkey]) info.param[fkey] = []
         info.param[fkey][paramId] = paramKey
         return info
      }
   }

   /**
    * 指定一个服务处理函数的参数来自于命令的第二条斜线后的路径变量，只支持传入字符串
    */
   function pathVar(target: Object, fkey: string, paramId: number): any {
      return param(PATH_VARIABLE)(target, fkey, paramId)
   }

   /**
    * 将该类的一个方法注册成为一个定时执行的任务，以秒为单位，默认60s
    */
   function task(interval: number = 60): any {
      return (target: object, fkey: string, descriptor: any) => {
         const info = touch(target)
         if (!info.task) info.task = []
         info.task.push(new Task(fkey, interval))
         return info
      }
   }


   /**
    * 将该类的一个方法注册成为一个在程序结束后执行的任务
    */
   function final(target: object, fkey: string, descriptor: any): any {
      const info = touch(target)
      if (!info.final) info.final = []
      info.final.push(fkey)
      return info
   }

   // controller的命令解析规则
   /**
    * 使用 '类的注册名字/方法注册名/路径变变量' 的方式进行请求
    */
   function createController(cKey: string, fKey: string): ControllerCtx | undefined {
      const info = components[cKey]
      if (!info || !info.isController) return undefined
      // 获取对象实例
      let instance
      try {
         instance = container.get<any>(cKey)
      } catch (_) { return undefined }
      const method = info.method(fKey)
      if (!method) return undefined
      const controller = new ControllerCtx(info, instance)
      controller.method = method
      controller.fKey = fKey
      controller.paramInfo = info.param[info.mapping[fKey]] ?? []
      controller.isTest = !!info.tests[fKey]
      return controller
   }


   /**
    *  每个iocController，需要调用contoller.init()来进行一些初始化工作
   */
   function init() {
      // 释放不用的注册信息
      tmp = undefined

      // 运行定时任务和最后任务
      const logger = useLogger('controller-task')
      for (const key in components) {
         const info = components[key]
         const instance = container.get(info.key)
         info.task?.forEach((task) => {
            setInterval(() => {
               try {
                  const f: Function = info.prototype[task.fname]
                  f.call(instance)
               } catch (e) { logger(e) }
            }, task.interval * 1000)
         })


         info.final?.forEach((name) => {
            const f: Function = info.prototype[name]
            addQuitCallback(() => f.call(instance))
         })
      }
   }


   return {
      container,
      components,
      inject,

      component,
      controller,
      test,
      factory,
      mapping,
      param,
      pathVar,
      task,
      final,
      init,
      createController,
   }
}
