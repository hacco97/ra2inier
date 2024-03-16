import { reactive, shallowReactive } from 'vue';

import { IpcRendererEvent } from 'electron/renderer';

import { listen, on, registerLog } from '@/boot/apis';
import { LogLevel, Message } from '@ra2inier/core';

// 消息通知模块的仓库
export const messageList = reactive<Message[]>([
   {
      id: 0,
      content: "欢迎使用ra2 inier",
      time: new Date().toLocaleString(),
      remark: '',
      sender: 'ra2 inier',
      level: LogLevel.info
   },
   {
      id: 1,
      content: "欢迎使用ra2 inier1",
      time: new Date().toLocaleString(),
      remark: '',
      sender: 'ra2 inier',
      level: LogLevel.warn
   },
   {
      id: 2,
      content: "欢迎使用ra2 inier2",
      time: new Date().toLocaleString(),
      remark: '',
      sender: 'ra2 inier',
      level: LogLevel.debug
   },
   {
      id: 3,
      content: "欢迎使用ra2 inier3",
      time: new Date().toLocaleString(),
      remark: '',
      sender: 'ra2 inier',
      level: LogLevel.error
   },
])
let nextID = messageList.length
const hooks: Record<string, Set<Function>> = {
   onMessage: new Set,
}

/**
 * 当新增消息时，可以被触发的回调函数
 */
export function onMessage(cb: () => void) {
   hooks.onMessage.add(cb)
}

export function pushMsg(sender: string, level: LogLevel, msg: string, remark?: any) {
   messageList.push({
      id: nextID++,
      content: msg,
      remark: remark ?? '',
      time: new Date().toLocaleString(),
      read: false,
      sender,
      level
   })
   hooks.onMessage.forEach(cb => cb())
}

export default function useLog(sender: string) {
   return {
      debug(msg: string, remark?: any) {
         pushMsg(sender, LogLevel.debug, msg, remark)
      },
      info(msg: string, remark?: any) {
         pushMsg(sender, LogLevel.info, msg, remark)
      },
      warn(msg: string, remark?: any) {
         pushMsg(sender, LogLevel.warn, msg, remark)
      },
      error(msg: string, remark?: any) {
         pushMsg(sender, LogLevel.error, msg, remark)
      }
   }
}

registerLog(useLog('api-center'))

on('log-from-backend', (event: IpcRendererEvent, l: LogLevel, msg: string, remark?: any) => {
   (l in LogLevel) || (l = LogLevel.info)
   pushMsg('backend', l, msg, remark)
})


listen('send-log', ({ msg, level, remark }) => {
   pushMsg('worker', level, msg, remark)
})

export function readAll() {
   for (let msg of messageList) { msg.read = true }
}

export function clearAll() {
   messageList.splice(0)
}
