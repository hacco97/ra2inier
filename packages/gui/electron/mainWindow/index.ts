import { app, BrowserWindow, ipcMain, shell } from 'electron';
import config, { windowSize } from '~/boot/config';
import { addWindow, deleteAllWindows } from '~/windows';

import { escapePath } from '@ra2inier/core/node';

const url = config.DEV_URL
const mainWindowName = config.MAIN_WINDOW_NAME

export function createMainWindow() {
   const win = addWindow(mainWindowName, {
      show: false,
      frame: false,
      webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
         sandbox: true,
         preload: escapePath(__dirname, './preload.js')
      },
      ...(windowSize.getSize()),
   })

   // 根据环境变量，加载不同的页面
   if (url) {
      win.loadURL(url)
      win.webContents.openDevTools()
   } else {
      win.loadFile(escapePath(__dirname, './index.html'))
   }

   // 初始化必要的handlers
   setTimeout(() => useHandlers(win), 150)
   // 加载服务处理器
   setTimeout(() => useServices(win), 1150)
   return win
}


// 加载服务处理函数
function useServices(win: BrowserWindow) {
   import('./ioc.boot').then((ioc) => { ioc.init() })
}


// 加载必要的窗口开闭逻辑
function useHandlers(win: BrowserWindow) {
   if (!win) return
   win.on('ready-to-show', () => {
      win?.show()
      if (windowSize.max) win?.maximize()
   })

   win.on('maximize', () => {
      windowSize.maximun()
      win?.webContents.send('maximize')
   })

   win.on('unmaximize', () => {
      win?.webContents.send('unmaximize')
      windowSize.unmax()
   })

   // Make all links open with the browser, not with the application
   win.webContents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      return { action: 'deny' }
   })

   // win.webContents.on('will-navigate', (event, url) => { }) #344
   win.webContents.on('will-navigate', (ev, url) => {
      if (url.startsWith('https:')) shell.openExternal(url)
      ev.preventDefault()
   })

   // 隐藏
   ipcMain.on('hide-main-window', () => {
      win?.minimize()
   })

   //最大化
   ipcMain.on('show-main-window', () => {
      win?.maximize()
   })

   //还原
   ipcMain.on('orignal-main-window', () => {
      win?.unmaximize()
   })

   ipcMain.on('close-main-window', () => {
      windowSize.setSize(win.getBounds())
      deleteAllWindows()
      app.quit()
   })
}

