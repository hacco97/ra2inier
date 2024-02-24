import { app, ipcMain } from 'electron'
import './boot'
import { deleteAllWindows, getMainWindow } from './windows'
import { createMainWindow } from './mainWindow'
import { createGithubWindow } from './githubWindow'


// 创建主窗口
app.whenReady().then(createMainWindow)

app.on('activate', () => {
   const mainWindow = getMainWindow()
   if (mainWindow) {
      mainWindow.focus()
   } else {
      createMainWindow()
   }
})

app.on('second-instance', () => {
   const mainWindow = getMainWindow()
   if (mainWindow) {
      // 在开启第二实例的时候，focus主窗口
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
   }
})

if (!app.requestSingleInstanceLock()) {
   deleteAllWindows()
}

ipcMain.on('open-window', (ev, name: string) => {
   if (name === 'github') createGithubWindow()
})
