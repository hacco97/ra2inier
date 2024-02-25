import { LogLevel } from '@ra2inier/core';

/**
 * 可执行的工作类型注册列表
 */
export const worksMap: Record<string, Function> = {}

/**
 * 正在进行的请求列表
 */
export const postMaps: Record<string, Function> = {}

type Handler = (data: any) => any

export function deleteWork(command: string) {
   if (command in worksMap)
      delete worksMap[command]
}

/**
 * 注册工作监听器
 */
export function on(command: string, handler: Handler) {
   worksMap[command] = handler
}

export function off(command: string, handler: Handler) {
   delete worksMap[command]
}

/**
 * 向主线程发起请求
 */
export function post<T>(channel: string, data: Record<string, any>) {
   return new Promise<ServResponse<T>>((solve) => {
      const postId = Math.random() + ''
      postMessage({
         id: postId,
         channel,
         data
      })
      postMaps[postId] = solve
   })
}

self.addEventListener('message', async (ev: MessageEvent) => {
   const { id, command, data, status } = ev.data
   if (command in worksMap) {
      const res: Record<string, any> = {
         id,
         data: '没有该命令：' + command,
         status: false
      }
      if (!(command in worksMap))
         return postMessage(res)
      try {
         res.data = await worksMap[command](data)
         res.status = true
      } catch (error) {
         res.data = error
      } finally {
         postMessage(res)
      }
   } else if (id in postMaps) {
      // 处理主线程的响应
      postMaps[id]({ data, status })
      delete postMaps[id]
   }
})

/**
 * 向主线程发送日志
 */
export const log = {
   debug(msg: string, remark?: any) {
      post('send-log', { msg, remark, level: LogLevel.debug })
   },
   info(msg: string, remark?: any) {
      post('send-log', { msg, remark, level: LogLevel.info })
   },
   warn(msg: string, remark?: any) {
      post('send-log', { msg, remark, level: LogLevel.warn })
   },
   error(msg: string, remark?: any) {
      post('send-log', { msg, remark, level: LogLevel.error })
   }
}


/**
 * 建立worker到后端的直接交流通道
 */
let port: MessagePort
const postMapsBackend: Record<string, Function> = {}

self.addEventListener('message', function establishPort(ev: MessageEvent) {
   if (!(ev.ports[0] && ev.data === 'give you port')) return
   port = ev.ports[0]
   self.removeEventListener('message', establishPort)
   port.addEventListener('message', (ev) => {
      const { id, res } = ev.data
      if (postMapsBackend[id]) {
         postMapsBackend[id](res)
         delete postMapsBackend[id]
      }
   })
   port.start()
})

export function exec<T>(command: string, options: RequestOptions = {}) {
   return new Promise<ServResponse<T>>((solve) => {
      const id = Math.random() + ''
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
      postMapsBackend[id] = solve

      setTimeout(() => {
         if (postMapsBackend[id]) {
            delete postMapsBackend[id]
            // @ts-ignore
            solve({ status: false, data: 'timeout' })
         }
      }, options.timeout ?? 60_000)
   })
}
