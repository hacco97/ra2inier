import fs from 'node:fs';

import { ClientConfig, Config, fromRaw, WindowSize } from '@ra2inier/core';
import { escapePath, readJson, writeJson } from '@ra2inier/core/node';

const CONFIG_PATH = escapePath('config.json')
// const CONFIG_PATH = escapePath(process.env['APPDATA'] ?? '', './ra2 inier', 'config.json')

/**
 * 设置默认值
 */
const defaultConfig: Partial<Config> = {
   THEME: 'dark',
   GPU: 'yes',
   PROJECT_PATH: '',
   WINDOW_SIZE: '0,0,1280,960',
   OUTPUT_DIR: escapePath('./out'),
   FILE_PROTOCOL: import.meta.env.VITE_PROTOCOL,
   THEME_DIR: escapePath('./custom/theme'),
   LOG_FILE_DIR: escapePath('./custom/log'),
   GLOBAL_ADDONS_DIR: escapePath('./library/addons'),
   GLOBAL_PACKAGE_DIR: escapePath('./library/reference'),
   GLOBAL_PACKAGE_CACHE: escapePath('./custom/reference'),
   GLOBAL_TUTORIAL_DIR: escapePath('./library/tutorial'),
   CWD: escapePath(process.cwd()),
   MAIN_WINDOW_NAME: import.meta.env.VITE_MAIN_PARTITION,
   IS_DEV: import.meta.env.DEV,
   DEV_URL: import.meta.env.VITE_DEV_SERVER_URL || "",
   CONFIG_AUTOSAVE_INTERVAL: 1000 * 60 * 6,
   VITE_VUE_DEVTOOLS: escapePath(import.meta.env.VITE_VUE_DEVTOOLS),
   DEFAULT_PROJECT_DIR: escapePath('./projects'),
   MAX_TAB_AMOUNT: 30,
   DEBUG_MODE: import.meta.env.DEV
}

// 读取用户已经保存的配置
const userConfig = readJson(CONFIG_PATH)

// 合并默认配置和用户配置
const config: Config = {
   ...defaultConfig,
   ...userConfig,
   saveConfig,
   setByKey: setConfigByKey,
   getClientConfig,
   addProjectHistory
}
export default <Readonly<Config>>config
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

/**
 * 添加一条项目历史
 */
function addProjectHistory(history: string) {
   const hs = config.PROJECT_HISTORY ?? []
   for (const h of hs) {
      if (h === history) return history
   }
   hs.push(history)
   config.PROJECT_HISTORY = hs
   if (hs.length > 8) return hs.shift()!
   else return history
}
