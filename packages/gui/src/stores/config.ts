import { reactive } from 'vue';

import { exec } from '@/boot/apis';
import { Config, copy } from '@ra2inier/core';

import useLog from './messageStore';

// 全局配置信息的仓库
const log = useLog('config-store')

const config = reactive(new Config)
let loaded = false
function loadConfig() {
   exec<Config>('config/client').then((res) => {
      if (res.status) {
         copy(res.data, config)
      }
   })
}

setTimeout(loadConfig, 200)

export function useConfig() {
   if (!config.value && !loaded) loadConfig()
   return config
}

export const IS_DEV = import.meta.env.DEV

export async function openDir() {
   return exec<string>('dialog/open/dir').then((res) => {
      if (res.status) {
         return res.data
      } else return
   })
}
