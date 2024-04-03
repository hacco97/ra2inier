import { reactive, readonly } from 'vue';
import { exec } from '@/boot/apis';
import { Config } from '@ra2inier/core';
import { defineStore } from 'pinia';

// 全局配置信息的仓库
const IS_DEV = import.meta.env.DEV;

async function loadConfig() {
   return exec<Config>('config/client').then((res) => {
      if (res.status) return res.data
      return <Config>{}
   })
}

/**
 * 真单例
 */
export const useConfigStore = defineStore('config-store', () => {
   const config: Config = reactive(new Config);
   loadConfig().then((res) => {
      Object.assign(config, res)
   })

   function setConfig(key: string, value: string) {
      exec('config/set', { key, value }).then((res) => {
         if (res.status) { config[key] = value }
      })
   }

   function $reset() {
      loadConfig().then((res) => {
         for (const key in config) { delete config[key] }
         Object.assign(config, res)
      })
   }

   return {
      get IS_DEV() { return IS_DEV },
      config: readonly(config),
      set: setConfig,
      $reset
   }
})
