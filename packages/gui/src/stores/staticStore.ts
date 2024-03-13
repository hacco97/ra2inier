import { reactive } from 'vue';

import { exec } from '@/boot/apis';

import useLog from './messageStore';
import { Package, forIn, fromRaw } from '@ra2inier/core';

const globalPackages: Record<string, Package> = reactive({})

const logger = useLog('static-store')

/**
 * 获得全局的library中的本地包
 * @returns pkg { 包名：路径 }
 */
export function useGlobalPackages() {
   exec<Record<string, Package>>('static/packages', { index: true })
      .then(({ status, data }) => {
         if (!status) return logger.debug('查询全局包失败', data)
         forIn(data, (key, pkg) => {
            globalPackages[key] = fromRaw(pkg, Package)
         })
      })
   return <Readonly<Record<string, Package>>>globalPackages
}

export function openD() {

}
