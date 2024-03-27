import { reactive, readonly } from 'vue';

import { exec } from '@/boot/apis';
import { Config } from '@ra2inier/core';

import useLog from './messageStore';
import { defineStore } from 'pinia';

// 全局配置信息的仓库

const log = useLog('config-store')
let loaded = false
const config = reactive(new Config)
const IS_DEV = import.meta.env.DEV;

async function loadConfig() {
   return exec<Config>('config/client').then((res) => {
      if (res.status) Object.assign(config, res.data)
   })
}


function setConfig(key: string, value: string) {
   exec('config/set', { key, value }).then((res) => {
      if (res.status) { config[key] = value }
   })
}

export function useConfigStore() {
   if (!loaded) loadConfig()
   return {
      IS_DEV,
      config: readonly(config),
      set: setConfig
   }
}

