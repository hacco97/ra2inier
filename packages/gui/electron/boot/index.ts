import os from 'node:os'
import { app, nativeTheme, session, Menu } from 'electron'
import { escapePath } from '@ra2inier/core/node'
import config, { saveConfig } from './config'
import { addQuitCallback } from './final'
import './fileProtocol'
import './logger'

// 根据配置禁用GPU
if (config.GPU == 'no') app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())
const platform = process.platform || os.platform()
try {
   if (platform === 'win32' && nativeTheme.shouldUseDarkColors === true) {
      require('node:fs').unlinkSync(
         escapePath(app.getPath('userData'), 'DevTools Extensions')
      )
   }
} catch (_) { }

// 禁用应用的原生菜单栏和原生右键菜单
if (!config.IS_DEV) Menu.setApplicationMenu(null)
// Menu.setApplicationMenu(null)


// 加载vue开发插件
app.whenReady().then(() => {
   if (config.IS_DEV) {
      session.defaultSession.loadExtension(escapePath(config.VITE_VUE_DEVTOOLS))
   }
})

// 每5分钟自动存储一下，配置文件
setInterval(saveConfig, config.CONFIG_AUTOSAVE_INTERVAL)

// 在程序结束的时候保存配置文件
addQuitCallback(saveConfig)
