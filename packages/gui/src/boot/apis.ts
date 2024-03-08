import MyWorker from '@/worker?worker';
import { EventEmitter, Logger } from '@ra2inier/core';

// 初始化日志和端口
let log: Logger
let port: MessagePort

export function registerLog(logObject: Logger) {
   log = logObject
}

// 使用send和on模拟的异步请求api
const requestMap: Record<string, Function> = {}

/**
 * 向主进程发起请求并执行指定命令
 */
export function exec<T>(command: string, options: RequestOptions = {}): Promise<ServResponse<T>> {
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

export const on = window.eApi.on
export const send = window.eApi.send



// ******************* 与worker的交互逻辑，主页面可以调用work方法让work执行相应的任务 **********************
const worker = new MyWorker()
const worksQueue: Record<string, Function> = {}
const listeners: Record<string, Function> = {}

/**
 * 向工作者线程发起请求以执行命令
 */
export function work<T>(command: string, data: Record<string, any>) {
   return new Promise<ServResponse<T>>((solve) => {
      const id = Math.random() + ''
      worker.postMessage({ id, command, data })
      worksQueue[id] = solve
      setTimeout(() => {
         delete worksQueue[id]
         // @ts-ignore
         solve({ status: false, data: 'timeout' })
      }, 15_000)
   })
}

/**
 * 添加处理工作者线程发起的请求
 */
export function listen(channel: string, listener: (data: Record<string, any>) => any) {
   if (channel in listeners) throw Error(`listener channel: ${channel} has exsited.`)
   listeners[channel] = listener
}

worker.addEventListener('message', async (ev) => {
   const { id, data, status, channel } = ev.data
   if (id in worksQueue) {
      // 处理worker线程的响应数据
      worksQueue[id]({ status, data })
      delete worksQueue[id]
   } else if (channel in listeners) {
      // 处理worker线程的请求
      const res: Record<string, any> = {
         id,
         data: '没有该通道：' + id,
         status: false
      }
      if (!(channel in listeners))
         return worker.postMessage(res)
      try {
         res.data = await listeners[channel](data)
         res.status = true
      } catch (error) {
         res.data = error
      } finally {
         worker.postMessage(res)
      }
   }
})

window.addEventListener('message', (ev) => {
   if (ev.data !== 'establish-port-worker-pass') return
   if (ev.ports[0]) {
      const trans = [ev.ports[0]]
      worker.postMessage('give you port', trans)
   }
})



// ******************* Event bus，全局事件订阅逻辑 **********************

export const globalEvent = new EventEmitter
