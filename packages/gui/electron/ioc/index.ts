import { BrowserWindow, ipcMain, MessageChannelMain } from 'electron';
import config from '~/boot/config';
import { useLogger } from '~/boot/logger';

import { servReject, servSolve } from '@ra2inier/core';

import { getWindowByName } from '../windows';
import { createIocController, PATH_VARIABLE } from './IocController';

type IocContainerInfo = ReturnType<typeof createIocController>

const logger = useLogger('ioc-center')

// 为每个新建的窗口分配controller
const containerMap = new WeakMap<BrowserWindow, IocContainerInfo>()

/**
 * 使用注解进行声明式编程，使用ioc容器实现业务模块松耦合
 * @param {name}  string - 注册窗口的名字
 * @returns 返回用于注册使用的注解函数
 *
 */
export function useIocControllers(windowName: string): IocContainerInfo {
   // 获取窗口来获得
   const window = getWindowByName(windowName)
   if (!window) throw Error('没有名为“' + windowName + '”的窗口')
   // 使用关于'窗口名字'的单例模式
   if (!containerMap.has(window)) {
      const ioc = createIocController()
      attachController(windowName, window, ioc)
      containerMap.set(window, ioc)
   }
   return containerMap.get(window)!
}


function attachController(name: string, window: BrowserWindow, iocController: IocContainerInfo) {
   const container = iocController.container
   // 为容器绑定一些初始对象
   container.bind('app-config').toConstantValue(config)
   container.bind('client-config').toConstantValue(config.getClientConfig())
   container.bind('window').toConstantValue(window)


   function sendBack(id: number, res: any) {
      if (!window) throw Error('ioc容器的window没有初始化')
      window.webContents.send(name + '-exec-back', id, res)
   }

   function parseCommand(command: string) {
      let [cKey, fKey, pathVar] = command.split('/').map((val) => val ? val.trim() : '')
      return {
         cKey,
         fKey,
         pathVar
      }
   }

   function handler(event: any, id: number, command: string, options: RequestOptions) {
      // 从ioc容器中获取相应的对象和handler
      const { cKey, fKey, pathVar } = parseCommand(command)
      const controller = iocController.createController(cKey, fKey)
      if (!controller) return sendBack(id, servReject('没有该命令：' + command))

      //为服务注册参数和环境变量
      options = { ...options }
      options.window = window
      options.reject = servReject
      options[PATH_VARIABLE] = pathVar

      // 调用处理函数
      if (!controller.isTest)
         controller.call(options).then((res: any) => sendBack(id, servSolve(res)))
            .catch((reason) => {
               logger(reason)
               sendBack(id, servReject('命令执行失败：' + command + '。' + reason.message))
            })
      else controller.test(options).then((res: any) => { sendBack(id, servSolve(res)) })
   }

   // 为该窗口启动监听
   ipcMain.on(name + '-exec', handler)

   ipcMain.on('establish-port', () => {
      const { port1, port2 } = new MessageChannelMain
      window.webContents.postMessage('establish-port-response', null, [port2])
      port1.start()
      port1.addListener('message', (ev) => {
         const { id, command, options } = ev.data
         handler(null, id, command, options)
      })
   })
}

