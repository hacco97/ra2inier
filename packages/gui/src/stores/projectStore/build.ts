
import { work } from '@/boot/apis';
import { forIn } from '@ra2inier/core';

import useLog from '../messageStore';
import { all } from './computed'

const logger = useLog('project-store')

/**
 * 项目构建逻辑
 */
let building = false

/**
 * 构建项目
 */
export function build() {
   if (building) return
   const buildList: string[] = []
   // TODO: 从UI读取BuildList，此处暂时为全部构建
   forIn(all.value.objects, (key, val) => { buildList.push(key) })
   work<boolean>('project/build', buildList).then(({ status, data }) => {
      if (status) {
         logger.info('构建成功')
      } else {
         logger.warn('构建失败', data)
      }
   })
}
