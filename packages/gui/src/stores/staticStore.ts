import { reactive } from 'vue';

import { exec } from '@/boot/apis';

import useLog from './messageStore';

const globalPackages = reactive({})

const logger = useLog('static-store')

/**
 * 获得全局的library中的本地包
 */
export function useGlobalPackages() {
   exec<Record<string, string>>('static/packages', { index: true })
      .then(({ status, data }) => {
         if (!status) return logger.debug('查询全局包失败', data)
         Object.assign(globalPackages, data)
      })
   return <Readonly<Record<string, string>>>globalPackages
}

