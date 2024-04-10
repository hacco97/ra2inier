import { reactive } from 'vue';
import { exec, useLogger } from '@/boot/apis';
import { Package, cloneTyped, forIn } from '@ra2inier/core';

const globalPackages: Record<string, Package> = reactive({})

const logger = useLogger('static-store')

/**
 * 获得全局的library中的本地包
 * @returns pkg { 包名：路径 }
 */
export function useGlobalPackages() {
   exec<Record<string, Package>>('static/packages', { index: true })
      .then(({ status, data }) => {
         if (!status) return logger.debug('查询全局包失败', data)
         forIn(data, (key, pkg) => {
            globalPackages[key] = cloneTyped(pkg, Package)
         })
      })
   return <Readonly<Record<string, Package>>>globalPackages
}

export function addGlobalPackage(pkg: Package) {

}
