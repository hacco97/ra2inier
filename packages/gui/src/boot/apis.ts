
import { Logger } from '@ra2inier/core';

export { openDirectory } from './file'
export { work, listen } from './worker'
export const on = window.eApi.on
export const send = window.eApi.send
export { globalEvent } from './event'

/**
 * 建立
 */
function createAPI() {
   // 初始化日志和端口
   let log: Logger
   let port: MessagePort

   function registerLog(logObject: Logger) {
      log = logObject
   }

   // 使用send和on模拟的异步请求api
   const requestMap: Record<string, Function> = {}

   /**
    * 向主进程发起请求并执行指定命令
    */
   function exec<T>(command: string, options: RequestOptions = {}): Promise<ServResponse<T>> {
      return new Promise((solve) => {
         const id = Math.random()
         requestMap[id] = solve
         const f = () => {
            try {
               const tmp = options.data
               if (tmp && tmp.toDto) options.data = tmp.toDto()
               port.postMessage({ id, command, options })
            }
            catch (error) {
               log.error('命令发送失败', {
                  command,
                  error,
                  options
               })
            }
         }
         if (CONTROLL_READY) f()
         else execQueue.push(f)

         // 设置请求超时，默认为一分钟
         setTimeout(() => {
            if (requestMap[id]) {
               delete requestMap[id]
               // @ts-ignore
               solve({ status: false, data: 'timeout' })
            }
         }, options.timeout ?? 60_000)
      })
   }

   // 监听建立交流端口
   window.addEventListener('message', (ev) => {
      if (ev.data !== 'establish-port-pass') return
      port = ev.ports[0]
      port.addEventListener('message', (ev) => {
         const { id, res } = ev.data
         if (requestMap[id]) {
            requestMap[id](res)
            delete requestMap[id]
         }
      })
      port.start()
      clearQueue()
   })


   // 同步controller API 初始加载延时逻辑
   var CONTROLL_READY = false
   const execQueue: Function[] = []
   const clearQueue = () => {
      CONTROLL_READY = true
      execQueue.forEach(f => f())
      execQueue.splice(0)
   }


   return {
      exec,
      registerLog
   }
}

export const { exec, registerLog } = createAPI()
