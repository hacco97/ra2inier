import { shallowReactive } from 'vue';

import { EventBus } from '@/hooks/eventBus';
import { dateTime } from '@ra2inier/core';

/**
 * 历史操作对象
 */
export class History {
   /**
    * 消息的产生者编号
    */
   sender: number = 0
   /**
    * 操作时间
    */
   time: string = ''
   /**
    * 被操作的数据
    */
   data: any
   /**
    * 回滚控制器
    */
   rollback: RollbackFunction = () => { }
}

/**
 * 历史管理中心
 */
class HistoryCenter extends EventBus {
   histories: History[] = shallowReactive([])
}

const center = new HistoryCenter

export interface RollbackFunction {
   (data: any): void
}

/**
 * 添加一条历史
 */
function pushHistory(sender: number, data: any, rollback: RollbackFunction) {
   center.histories.push({
      sender,
      time: dateTime(),
      data,
      rollback
   })
}

/**
 * 回滚历史
 */
function rollbackHistory(sender: number) {
   const histories = center.histories
   for (let i = histories.length - 1; i >= 0; --i) {
      const h = histories[i]
      if (h.sender === sender) {
         histories.splice(i, 1)
         h.rollback(h.data)
         return true
      }
   }
   return false
}

/**
 * 使用历史控制器
 */
export function useHistory(rollback: RollbackFunction, sender = Math.random()) {
   return {
      push(data: any) {
         console.log('history pushed:', data)
         pushHistory(sender, data, rollback)
      },
      rollback() {
         return rollbackHistory(sender)
      },
      center
   }
}
