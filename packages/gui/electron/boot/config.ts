import fs from 'node:fs'
import { resolve } from 'node:path'
import { escapePath, readJson, writeJson } from '@ra2inier/core/node'
import { ClientConfig, Config, WindowSize, fromRaw } from '@ra2inier/core'

const CONFIG_PATH = escapePath('config.json')
// const CONFIG_PATH = escapePath(process.env['APPDATA'] ?? '', './ra2 inier', 'config.json')
const defaultConfig = {
   // 客户端的主题
   THEME: 'dark',
   // 开启GPU加速  yes  or  no
   GPU: 'yes',
   // 当前的项目位置
   PROJECT_PATH: '',
   // 窗口大小状态
   WINDOW_SIZE: '0,0,1280,960',
   // 默认的文件系统协议
   FILE_PROTOCOL: import.meta.env.VITE_PROTOCOL,
   // 默认的客户端主题位置
   THEME_DIR: escapePath('./custom/theme'),
   // 日志文件位置
   LOG_FILE_DIR: escapePath('./custom/log'),
   // 字典的默认位置
   GLOBAL_DICT_DIR: escapePath('./library/dictionary'),
   // 全局第三方可执行文件的位置
   GLOBAL_ADDONS_DIR: escapePath('./library/addons'),
   // 全局包的位置
   GLOBAL_PACKAGE_DIR: escapePath('./library/reference'),
   // 全局教程文件的位置
   GLOBAL_TUTORIAL_DIR: escapePath('./library/reference'),
   // 当前程序的启动位置
   CWD: escapePath(process.cwd()),
   // 主窗口名字
   MAIN_WINDOW_NAME: import.meta.env.VITE_MAIN_PARTITION,
   // 正在开发模式下
   IS_DEV: import.meta.env.DEV,
   // 开发服务器的URL
   DEV_URL: import.meta.env.VITE_DEV_SERVER_URL ?? "",
   // 配置自动保存的时间间隔
   CONFIG_AUTOSAVE_INTERVAL: 1000 * 60 * 6,
   // vue开发插件的路径
   VITE_VUE_DEVTOOLS: resolve(import.meta.env.VITE_VUE_DEVTOOLS)
}


// 读取用户已经保存的配置
const userConfig = readJson(CONFIG_PATH)

// 合并默认配置和用户配置
const config: Config = {
   ...defaultConfig,
   ...userConfig,
   saveConfig,
   setByKey: setConfigByKey,
   getClientConfig
}
export default config
export const windowSize = new WindowSize(config.WINDOW_SIZE)

export function saveConfig() {
   writeJson(CONFIG_PATH, {
      THEME: config.THEME,
      GPU: config.GPU,
      PROJECT_PATH: config.PROJECT_PATH,
      WINDOW_SIZE: windowSize.toString()
   })
}

export function setConfigByKey(key: string, val: any) {
   config[key] = val
}

export function getClientConfig() {
   return fromRaw(config, ClientConfig)
}

// 没有配置文件则创建一个，持久化
if (!fs.existsSync(CONFIG_PATH)) saveConfig()

