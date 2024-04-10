import { reactive, readonly } from 'vue';
import { exec, useLogger } from '@/boot/apis';
import { ClientConfig, Config, useSingleton } from '@ra2inier/core';
import { defineStore } from 'pinia';

// 全局配置信息的仓库
const IS_DEV = import.meta.env.DEV;

async function loadConfig() {
   const { status, data } = await exec<Config>('config/client')
   return status && data
}

export async function getThemeMap() {
   const { status, data } = await exec<Record<string, string>>('config/themes')
   return status ? data : {}
}

export async function saveTheme(name: string, text: string) {
   const { status, data } = await exec<boolean>('config/save-theme', { name, text })
   return (status && data)
}

/**
 * 配置文件仓库，全局单例
 */
export const useConfigStore = defineStore('config-store', useSingleton(() => {
   const config = reactive(new ClientConfig)
   loadConfig().then((res) => Object.assign(config, res))
   const logger = useLogger('config-store')

   async function getConfig(key: string) {
      const { status, data } = await exec<string>('config/get/' + key)
      return status ? data : ""
   }

   async function setConfig(key: keyof Config, value: string) {
      const { status, data } = await exec<boolean>('config/set', { key, value })
      if (status && data) config[key] = value
      else logger.warn('配置保存失败')
      return !!(status && data)
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
      get: getConfig,
      $reset
   }
}))
