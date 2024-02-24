import MyWorker from '@/worker?worker';
import { Logger } from '@ra2inier/core';

const CHANNEL_TO = import.meta.env.VITE_MAIN_PARTITION + '-exec'
const CHANNEL_BACK = CHANNEL_TO + '-back'

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
            // eApi.send(CHANNEL_TO, id, command, options)
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
eApi.on(CHANNEL_BACK, (event, id, res) => {
   if (requestMap[id]) {
      requestMap[id](res)
      delete requestMap[id]
   }
})

// 同步controller API 初始加载延时逻辑
var CONTROLL_READY = false
const execQueue: Function[] = []
const clearQueue = () => {
   CONTROLL_READY = true
   execQueue.forEach(f => f())
   execQueue.splice(0)
}
eApi.on('service-ready', clearQueue)
setTimeout(clearQueue, 2000)

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
   // console.log(ev)
   if (ev.data !== 'establish-port-pass') return
   port = ev.ports[0]
   // worker.postMessage('give you port', trans)
})
